import { API } from '../constants/endpoints';
import { BaseApi } from './BaseApi';

export interface NewUser {
  username: string;
  password: string;
  empNumber: number;
  roleId: number;
}

export class UserApi extends BaseApi {
  constructor(request: ConstructorParameters<typeof BaseApi>[0]) {
    super(request, 'UserApi');
  }

  /** Creates a system user and returns its id. */
  async create(user: NewUser): Promise<number | null> {
    const res = await this.post(API.users, {
      username: user.username,
      password: user.password,
      status: true,
      userRoleId: user.roleId,
      empNumber: user.empNumber,
    });
    await this.ensureOk(res, 'Create user');
    const body = (await res.json()) as { data?: { id?: number } };
    return body.data?.id ?? (await this.findIdByUsername(user.username));
  }

  async findIdByUsername(username: string): Promise<number | null> {
    const res = await this.get(API.users, { username, limit: 5 });
    if (!res.ok()) return null;
    const body = (await res.json()) as { data?: { id: number; userName: string }[] };
    return body.data?.find((u) => u.userName === username)?.id ?? null;
  }

  /** Cleanup helper. Returns false instead of throwing. */
  async deleteQuietly(userId: number | null): Promise<boolean> {
    if (userId === null) return false;
    try {
      const res = await this.remove(API.users, { ids: [userId] });
      if (res.ok()) return true;
      this.log.warn(`User ${userId} was not deleted (HTTP ${res.status()})`);
    } catch (error) {
      this.log.warn(`Cleanup of user ${userId} failed`, error);
    }
    return false;
  }
}
