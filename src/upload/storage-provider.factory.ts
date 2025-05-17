import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from './interfaces/storage-provider.interface';
import { FirebaseStorageProvider } from './providers/firebase.provider';
import { CloudinaryStorageProvider } from './providers/cloudinary.provider';

export type StorageType = 'firebase' | 'local' | 'cloudinary' | 's3'; //any storage provider

@Injectable()
export class StorageProviderFactory {
  constructor(private configService: ConfigService) {}

  createProvider(type?: StorageType): StorageProvider {
    // Use provided type or get from config
    const storageType =
      type || this.configService.get<StorageType>('STORAGE_TYPE', 'cloudinary');

    switch (storageType) {
      case 'firebase':
        return new FirebaseStorageProvider(this.configService);
      case 'cloudinary':
        return new CloudinaryStorageProvider(this.configService);
      default:
        return new CloudinaryStorageProvider(this.configService);
    }
  }
}
