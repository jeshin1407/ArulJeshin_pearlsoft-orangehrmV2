const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 } as const;
type Level = keyof typeof LEVELS;

function threshold(): number {
  const configured = process.env.LOG_LEVEL?.toLowerCase() as Level | undefined;
  return configured && configured in LEVELS ? LEVELS[configured] : LEVELS.info;
}

function write(level: Level, scope: string, message: string, meta?: unknown): void {
  if (LEVELS[level] < threshold()) return;
  const line = `${new Date().toISOString()} ${level.toUpperCase().padEnd(5)} [${scope}] ${message}`;
  const out = level === 'warn' || level === 'error' ? console.error : console.log;
  if (meta === undefined) out(line);
  else out(line, meta);
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, meta?: unknown) => write('debug', scope, message, meta),
    info: (message: string, meta?: unknown) => write('info', scope, message, meta),
    warn: (message: string, meta?: unknown) => write('warn', scope, message, meta),
    error: (message: string, meta?: unknown) => write('error', scope, message, meta),
  };
}
