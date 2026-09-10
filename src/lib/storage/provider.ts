export type UploadRequest = { key: string; contentType: string; size: number };

export interface ObjectStorageProvider {
  upload(request: UploadRequest, body: ReadableStream<Uint8Array>): Promise<{ key: string; url: string }>;
  delete(key: string): Promise<void>;
}