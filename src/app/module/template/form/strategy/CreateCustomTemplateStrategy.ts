import {Format, Header, Template} from 'src/app/model/Template';
import {CreateTemplateStrategy} from './CreateTemplateStrategy';
import {TemplateContext} from './TemplateContext';
import {TemplateService} from 'src/app/service/template/template.service';

export class CreateCustomTemplateStrategy implements CreateTemplateStrategy {

  constructor(private _service: TemplateService) {
  }

  async execute(context: TemplateContext): Promise<void> {
    const template = context.form.value as Template;
    template.components = [];

    this.reviseHeader(context.form.get('header').value);

    template.components.push(context.form.get('header').value);
    template.components.push(context.form.get('body').value);
    template.components.push(context.form.get('footer').value);

    !context.form.get('id').value
      ? await this._service.create(template, context.selectedFile)
      : await this._service.update(template, context.selectedFile);
  }

  private reviseHeader(header: Header) {
    switch (header.format) {
      case Format.TEXT:
        if (header.example && header?.example?.headerText.length === 0) {
          delete header.example;
        }
        break;
    }
  }

}
