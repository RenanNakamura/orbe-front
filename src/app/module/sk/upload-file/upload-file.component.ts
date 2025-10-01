import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';

export interface SelectedFile {
  headers: HeaderFile[];
  amountOfRecords: number;
  file: File;
}

export interface HeaderFile {
  name: string;
  index: number;
}

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  @Output() changeFile = new EventEmitter<SelectedFile>();

  @ViewChild('fileInput') fileInput: ElementRef;

  file: File;
  accepts = ['text/csv'];
  acceptFiles = ['CSV'];

  constructor() {}

  onSelectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.changeSelectedFile(file);
  }

  onGetAcceptFiles() {
    return this.acceptFiles.join(', ');
  }

  onDeleteFile() {
    this.file = null;
    this.changeFile.emit(null);
    this.clearFileInput();
  }

  onFormatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  isFileSelected() {
    return !!this.file;
  }

  private clearFileInput() {
    this.fileInput.nativeElement.value = null;
  }

  private changeSelectedFile(file) {
    if (!file) {
      return;
    }

    this.file = file;
    this.readFile(file);
  }

  private readFile(fileUploaded: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const contents = e.target.result;
      const lines = contents.split('\n');

      if (lines.length > 1) {
        const header = lines[0];
        const headers = header.split(',');
        const dataLines = lines.slice(1);
        const size = dataLines?.length;
        const headersFile = headers.map((field, i) => {
          return {
            name: field.trim(),
            index: i
          };
        });
        const selectedFile: SelectedFile = {
          headers: headersFile,
          amountOfRecords: size,
          file: fileUploaded
        };

        this.changeFile.emit(selectedFile);
      }
    };

    reader.readAsText(fileUploaded);
  }
}
