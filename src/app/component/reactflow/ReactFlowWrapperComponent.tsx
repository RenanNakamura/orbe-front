import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as ReactDOM from 'react-dom/client';
import ReactFlowProviderComponent from './ReactFlowComponent';
import React from 'react';
import {WorkflowNode} from '../../model/flow/WorkflowNode';
import {Edge} from '@xyflow/react';
import {I18nextProvider} from 'react-i18next';
import i18n from './config/i18n';
import {LanguageService} from '../../service/sk/language.service';
import {Subscription} from 'rxjs';
import {UpdateFlowNodes} from "../../model/flow/Flow";

const containerElementRef = 'customReactComponentContainer';

@Component({
  selector: 'react-flow-wrapper',
  template: `<span #${containerElementRef}></span>`,
  encapsulation: ViewEncapsulation.None,
})
export class ReactFlowWrapperComponent implements OnDestroy, AfterViewInit {
  @ViewChild(containerElementRef, {static: true}) containerRef!: ElementRef;
  @Input() nodes: WorkflowNode[];
  @Input() edges: Edge[];
  @Input() viewport: any;
  @Output() onSubmit = new EventEmitter<UpdateFlowNodes>();
  private saveCallback: (() => void) | null = null;

  private langSubscription: Subscription;
  private root: ReactDOM.Root | null = null;

  constructor(private languageService: LanguageService) {
    this.onSubmitHandle = this.onSubmitHandle.bind(this);
  }

  ngAfterViewInit() {
    this.root = ReactDOM.createRoot(this.containerRef.nativeElement);

    this.langSubscription = this.languageService
      .lang$
      .subscribe(language => this.render(language));

    const lang = this.languageService.currentLang;
    this.render(lang);
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.unmount();
    }

    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  public onSubmitHandle(flow: UpdateFlowNodes) {
    if (this.onSubmit) {
      console.log('flow => ', flow)
      this.onSubmit.emit(flow);
    }
  }

  public triggerSave() {
    if (this.saveCallback) {
      this.saveCallback();
    }
  }

  private render(lang: string) {
    this.root?.render(
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <ReactFlowProviderComponent
            nodes={this.nodes}
            edges={this.edges}
            viewport={this.viewport}
            onSubmit={this.onSubmitHandle}
            setSaveCallback={(cb: () => void) => this.saveCallback = cb}
            lang={lang}
          />
        </I18nextProvider>
      </React.StrictMode>
    );
  }
}
