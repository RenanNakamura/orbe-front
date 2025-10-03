import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {fadeInRight400ms} from '@vex/animations/fade-in-right.animation';
import {scaleIn400ms} from '@vex/animations/scale-in.animation';
import {stagger40ms} from '@vex/animations/stagger.animation';
import {Flow, UpdateFlowNodes} from '../../../model/flow/Flow';
import {FlowService} from '../../../service/flow/flow.service';
import {MessageNode, NodeType} from '../../../model/flow/WorkflowNode';
import {MediaMessage, Type} from '../../../model/flow/Message';
import {StorageService} from '../../../service/storage/storage.service';
import {FileUtil} from '../../../util/file.util';
import {AlertService} from '../../../service/sk/alert.service';
import {TranslateService} from '@ngx-translate/core';
// import {ReactFlowWrapperComponent} from '../../../component/reactflow/ReactFlowWrapperComponent';

@Component({
  selector: 'vex-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [
    fadeInUp400ms,
    fadeInRight400ms,
    scaleIn400ms,
    stagger40ms
  ]
})
export class FormComponent implements OnInit {

  // @ViewChild(ReactFlowWrapperComponent)
  // reactFlowComp!: ReactFlowWrapperComponent;

  flow: Flow;
  fileNamesUploaded = [];
  isLoading = false;

  constructor(private _fb: UntypedFormBuilder,
              private _router: Router,
              private _service: FlowService,
              private _activatedRoute: ActivatedRoute,
              private _storageService: StorageService,
              private _alertService: AlertService,
              private _translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this._activatedRoute
      .data
      .subscribe(param => {
        this.flow = param?.['data'];
      });
  }

  async onSubmitNodes(flow: UpdateFlowNodes) {
    if (!this.isLoading) {
      try {
        this.isLoading = true;

        await this._processNodes(flow);
        await this._service.updateNodes(this.flow.id, flow);

        this.fileNamesUploaded = [];

        const message = this._translate.instant(`flow.saved`);
        await this._alertService.success(message);
      } catch (e) {
        console.error(e);
        this.rollbackFileUploaded();
        this.fileNamesUploaded = [];
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onSave() {
    // this.reactFlowComp.triggerSave();
  }

  private async _processNodes(flow: UpdateFlowNodes) {
    await this.validateNodes(flow);
    await this.validateMedias(flow);
    await this.uploadMedias(flow);
  }

  private async uploadMedias(flow: UpdateFlowNodes) {
    for (const node of flow.nodes) {
      switch (node.type) {
        case NodeType.MESSAGE:
          await this._processUploadMedias(node as MessageNode);
          break;
      }
    }
  }

  private async _processUploadMedias(node: MessageNode) {
    if (!node.messages) {
      return;
    }

    for (const message of node?.messages) {
      switch (message?.type) {
        case Type.IMAGE:
        case Type.VIDEO:
        case Type.DOCUMENT:
          await this._processMediaMessage(message as MediaMessage);
          break;
      }
    }
  }

  private async _processMediaMessage(message: MediaMessage) {
    if (message?.link && !message?.filename) {
      const file = await FileUtil.urlToFile(message.link, message.originalFilename);

      const fileUploaded = await this._storageService.upload(file);

      message.filename = fileUploaded?.filename;
      message.link = ``;

      this.fileNamesUploaded.push(fileUploaded?.filename);
    }
  }

  private async validateMedias(flow: UpdateFlowNodes) {
    for (const node of flow.nodes) {
      switch (node.type) {
        case NodeType.MESSAGE:
          await this._processValidateMedias(node as MessageNode);
          break;
      }
    }
  }

  private async _processValidateMedias(node: MessageNode) {
    if (!node.messages) {
      return;
    }

    for (const message of node?.messages) {
      switch (message?.type) {
        case Type.IMAGE:
          await this._processValidateMediaMessage(message as MediaMessage, Type.IMAGE.toString());
          break;
        case Type.VIDEO:
          await this._processValidateMediaMessage(message as MediaMessage, Type.VIDEO.toString());
          break;
        case Type.DOCUMENT:
          await this._processValidateMediaMessage(message as MediaMessage, Type.DOCUMENT.toString());
          break;
      }
    }
  }

  private async _processValidateMediaMessage(message: MediaMessage, type: string) {
    if (message?.link && !message?.filename) {
      const file = await FileUtil.urlToFile(message.link, message.originalFilename);

      await this._storageService.validateFile(file, type);
    }
  }

  private rollbackFileUploaded() {
    for (const fileName of this.fileNamesUploaded) {
      this._storageService.delete(fileName)
        .subscribe({
          next: (blob) => {

          },
          error: (err) => {
            console.error(`Error when delete file ${fileName} on storage`, err);
          }
        });
    }
  }

  private async validateNodes(flow: UpdateFlowNodes) {
    for (const node of flow?.nodes) {
      if (node?.type?.toString() === 'SELECT') {
        const message = this._translate.instant('node.type.select-node-invalid');
        await this._alertService.warning(message);
        throw new Error(message);
      }
    }
  }
}

