import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from '../interfaces/storage-provider.interface';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseStorageProvider implements StorageProvider {
  private readonly logger = new Logger(FirebaseStorageProvider.name);
  private readonly bucket;
  private readonly storageBucketUrl: string;

  constructor(private configService: ConfigService) {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT', '{}'),
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: this.configService.get<string>(
          'FIREBASE_STORAGE_BUCKET',
        ),
      });
    }

    this.bucket = admin.storage().bucket();
    this.storageBucketUrl = `https://storage.googleapis.com/${this.bucket.name}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    filename?: string,
  ): Promise<string> {
    try {
      const finalFilename = filename || `${Date.now()}-${file.originalname}`;
      const filePath = path.join(folder, finalFilename);

      // Create a file reference
      const fileRef = this.bucket.file(filePath);

      // Create a write stream
      const blobStream = fileRef.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        public: true, // Make file publicly accessible
      });

      // Return a promise that resolves with the public URL
      return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
          this.logger.error(`Failed to upload to Firebase: ${error.message}`);
          reject(error);
        });

        blobStream.on('finish', async () => {
          // Make the file publicly accessible
          await fileRef.makePublic();

          // Construct the public URL
          const publicUrl = `${this.storageBucketUrl}/${filePath}`;
          resolve(publicUrl);
        });

        // Write the file buffer to the stream
        blobStream.end(file.buffer);
      });
    } catch (error) {
      this.logger.error(`Failed to upload file to Firebase: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const filePath = this.getFilePathFromUrl(fileUrl);

      // Delete the file
      await this.bucket.file(filePath).delete();

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete file from Firebase: ${error.message}`,
      );
      return false;
    }
  }

  // Helper method to extract file path from public URL
  private getFilePathFromUrl(fileUrl: string): string {
    try {
      const url = new URL(fileUrl);
      // Remove bucket name and leading slash from path
      const bucketNameInUrl = `storage.googleapis.com/${this.bucket.name}/`;
      const fullPath = url.pathname;

      if (fullPath.includes(bucketNameInUrl)) {
        return fullPath.split(bucketNameInUrl)[1];
      }

      // If URL format is different, just take the part after the bucket name
      const parts = fullPath.split('/');
      // Remove first empty string from split and bucket name
      parts.splice(0, 2);
      return parts.join('/');
    } catch (error) {
      this.logger.error(`Failed to parse URL: ${error.message}`);
      throw new Error('Invalid file URL');
    }
  }
}
