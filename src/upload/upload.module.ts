import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './upload.service';
import {
  StorageProviderFactory,
  StorageType,
} from './storage-provider.factory';

@Module({})
export class UploadModule {
  /**
   * Register the module with default configuration (Cloudinary )
   */
  static register(): DynamicModule {
    return {
      module: UploadModule,
      imports: [ConfigModule],
      providers: [StorageProviderFactory, UploadService],
      exports: [UploadService],
    };
  }

  /**
   * Register the module with a specific storage type
   */
  static forFeature(options: {
    storageType: StorageType;
    name?: string;
  }): DynamicModule {
    // Create a unique provider token if name is provided
    const providerToken = options.name
      ? `UPLOAD_SERVICE_${options.name.toUpperCase()}`
      : 'UPLOAD_SERVICE';

    return {
      module: UploadModule,
      imports: [ConfigModule],
      providers: [
        StorageProviderFactory,
        {
          provide: providerToken,
          useFactory: (factory: StorageProviderFactory) => {
            return new UploadService(factory, options.storageType);
          },
          inject: [StorageProviderFactory],
        },
      ],
      exports: [providerToken],
    };
  }
}
