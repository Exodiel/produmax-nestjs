import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export type EnvConfig = Record<string, string>;
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      HOST: Joi.string(),
      PORT: Joi.number().default(3306),
      PORT_SERVER: Joi.number().default(4000),
      USERNAME: Joi.string(),
      PASSWORD: Joi.string(),
      COLLATION: Joi.string(),
      DATABASE: Joi.string(),
      JWT_SECRET: Joi.string(),
      EXPIRES_IN: Joi.number(),
      API_SECRET: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get nodeEnv(): string {
    return String(this.envConfig.NODE_ENV);
  }

  get host(): string {
    return String(this.envConfig.HOST);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get portServer(): number {
    return Number(this.envConfig.PORT_SERVER);
  }

  get userName(): string {
    return String(this.envConfig.USERNAME);
  }

  get password(): string {
    return String(this.envConfig.PASSWORD);
  }

  get collation(): string {
    return String(this.envConfig.COLLATION);
  }

  get database(): string {
    return String(this.envConfig.DATABASE);
  }

  get jwtSecret(): string {
    return String(this.envConfig.JWT_SECRET);
  }

  get expiresIn(): number {
    return Number(this.envConfig.EXPIRES_IN);
  }

  get apiSecret(): string {
    return String(this.envConfig.API_SECRET);
  }
}
