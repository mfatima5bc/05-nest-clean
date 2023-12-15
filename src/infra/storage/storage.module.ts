import { Module } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { Uploader } from '@/domain/forum/application/storage/uploader';
import { R2Storage } from './r2-storage';

@Module({
  imports: [EnvService],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
