import { API } from '../constants/endpoints';
import type { EmployeeData } from '../utils/dataFactory';
import { BaseApi } from './BaseApi';

export interface EmployeeRecord {
  empNumber: number;
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export class EmployeeApi extends BaseApi {
  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, 'EmployeeApi');
  }

  async create(data: EmployeeData): Promise<number> {
    const res = await this.post(API.employees, { ...data, empPicture: null });
    await this.ensureOk(res, 'Create employee');
    const body = (await res.json()) as { data: { empNumber: number } };
    return body.data.empNumber;
  }

  /** Returns the record, or null when the employee does not exist (any non 200 or empty data). */
  async find(empNumber: number): Promise<EmployeeRecord | null> {
    const res = await this.get(`${API.employees}/${empNumber}`);
    if (res.status() !== 200) return null;
    const body = (await res.json()) as { data: EmployeeRecord | null };
    return body.data ?? null;
  }

  /** Same as find, but fails loudly when the employee is missing. */
  async getOrThrow(empNumber: number): Promise<EmployeeRecord> {
    const record = await this.find(empNumber);
    if (!record) throw new Error(`Employee ${empNumber} was not found through the API`);
    return record;
  }

  async exists(empNumber: number): Promise<boolean> {
    return (await this.find(empNumber)) !== null;
  }

  /** Cleanup helper. Returns false instead of throwing, because cleanup must never fail a test. */
  async deleteQuietly(empNumber: number): Promise<boolean> {
    try {
      const res = await this.remove(API.employees, { ids: [empNumber] });
      if (res.ok()) return true;
      this.log.debug(`Employee ${empNumber} was not deleted (HTTP ${res.status()})`);
    } catch (error) {
      this.log.warn(`Cleanup of employee ${empNumber} failed`, error);
    }
    return false;
  }
}
