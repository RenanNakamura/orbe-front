import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Format } from '../../../model/Template';
import { LoadingService } from '../../../service/sk/loading.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedFile: File | null = null;
  @Input() format: Format = Format.IMAGE;
  @Output() fileSelectedOutput = new EventEmitter<File>();
  label = '';
  accept = '';
  icMidia = 'mat:insert_photo';

  constructor(private _loadingService: LoadingService) {}

  ngOnInit(): void {
    this.chooseIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chooseLabel();
    this.chooseIcon();
    this.chooseAccept();
  }

  ngOnDestroy(): void {
    if (this.selectedFile) {
      this.selectedFile = null;
      this.fileSelectedOutput.emit(null);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileSelectedOutput.emit(this.selectedFile);
    }
  }

  isSelectedFile(): boolean {
    return this.selectedFile != null;
  }

  private chooseLabel() {
    switch (this.format) {
      case Format.IMAGE:
        this.label = 'upload-image.select-image';
        break;

      case Format.DOCUMENT:
        this.label = 'upload-image.select-document';
        break;

      case Format.VIDEO:
        this.label = 'upload-image.select-video';
        break;
    }
  }

  private chooseIcon() {
    switch (this.format) {
      case Format.IMAGE:
        this.icMidia = 'mat:insert_photo';
        break;
      case Format.VIDEO:
        this.icMidia = 'mat:slow_motion_video';
        break;
      case Format.DOCUMENT:
        this.icMidia = 'mat:insert_drive_file';
        break;
    }
  }

  private chooseAccept() {
    switch (this.format) {
      case Format.IMAGE:
        this.accept = 'image/jpeg, image/png';
        break;
      case Format.VIDEO:
        this.accept = 'video/mp4';
        break;
      case Format.DOCUMENT:
        this.accept = 'application/pdf';
        break;
    }
  }
}
