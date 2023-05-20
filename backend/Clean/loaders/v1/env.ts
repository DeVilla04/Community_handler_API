class Env {
  static names = [
    "PORT",
    "DB_HOST",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "JWT_SECRET_KEY",
    "JWT_EXPIRES_IN",
  ] as const;

  static variable: Record<(typeof Env.names)[number], string>;

  static Loader() {
    const values: Record<string, string> = {};

    for (const key of Env.names) {
      const value = process.env[key];
      if (value) {
        values[key] = value;
      } else {
        console.error(`Environment variable ${key} is not defined.`);
        process.exit(1);
      }
    }

    Env.variable = values;
  }
}

export default Env;
