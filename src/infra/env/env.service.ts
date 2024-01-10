import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { env } from './env';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<env, true>) {}

  get<T extends keyof env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
