interface ImportMeta {
  VERSION: string
}

declare const logger: {
  level: string;
  levels: {
      values: Record<string, unknown>;
  };
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}
