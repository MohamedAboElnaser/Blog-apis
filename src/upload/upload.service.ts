import { Injectable, Logger, Optional } from '@nestjs/common';
import { StorageProvider } from './interfaces/storage-provider.interface';
import {
  StorageProviderFactory,
  StorageType,
} from './storage-provider.factory';

@Injectable()
export class UploadService {
  private provider: StorageProvider;
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private storageProviderFactory: StorageProviderFactory,
    @Optional() storageType?: StorageType,
  ) {
    this.provider = this.storageProviderFactory.createProvider(storageType);
    this.logger.log(
      `Using ${this.provider.constructor.name} as storage provider`,
    );
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    filename?: string,
  ): Promise<string> {
    try {
      const url = await this.provider.uploadFile(file, folder, filename);
      this.logger.log(`File uploaded: ${url}`);
      return url;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const result = await this.provider.deleteFile(fileUrl);
      this.logger.log(
        `File deletion ${result ? 'successful' : 'failed'}: ${fileUrl}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }
}
