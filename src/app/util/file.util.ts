export interface FileValidationResult {
    success: boolean;
    error?: string;
}

export class FileUtil {

    static readonly MEDIA_VALIDATION = {
        ['VIDEO']: {maxSize: 16 * 1024 * 1024, mimeTypes: ['video/mp4']},
        ['IMAGE']: {maxSize: 5 * 1024 * 1024, mimeTypes: ['image/png', 'image/jpeg']},
        ['DOCUMENT']: {
            maxSize: 100 * 1024 * 1024,
            mimeTypes: [
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/pdf'
            ]
        }
    };

    static getMediaValidation(type: string) {
        return this.MEDIA_VALIDATION[type];
    }

    static validateFile(file: File, type: string): FileValidationResult {
        const validation = this.MEDIA_VALIDATION[type];

        if (!validation) {
            return {
                success: false,
                error: 'TYPE_NOT_IMPLEMENTED'
            };
        }

        if (file?.size > validation.maxSize) {
            return {
                success: false,
                error: 'MAX_SIZE_EXCEEDED'
            };
        }

        if (!validation.mimeTypes.includes(file?.type)) {
            return {
                success: false,
                error: 'MIME_TYPE_NOT_ACCEPTED'
            };
        }

        return {
            success: true
        };
    }

    static blobToFile(blob: Blob, filename: string): File {
        return new File([blob], filename, {type: blob.type});
    }

    static async urlToFile(url: string, fileName: string): Promise<File> {
        const response = await fetch(url);
        const blob = await response.blob();

        const mimeType = blob.type || 'application/octet-stream';

        return new File([blob], `${fileName}`, {type: mimeType});
    }

}
