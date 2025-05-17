import { Express } from 'express';

export interface StorageProvider {
  uploadFile(
    file: Express.Multer.File,
    folder: string,
    filename?: string,
  ): Promise<string>;

  deleteFile(fileUrl: string): Promise<boolean>;
}
