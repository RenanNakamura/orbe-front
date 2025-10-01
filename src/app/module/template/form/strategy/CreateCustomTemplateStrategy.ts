import {Button, ButtonAction, Format, Header, Template} from 'src/app/model/Template';
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

        const button = this.filterButtonOnlyHasValue(context.form.get('button').value);

        if (button !== null) {
            template.components.push(button);
        }

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

    private filterButtonOnlyHasValue(button: Button): Button {
        switch (button?.action) {
            case ButtonAction.QUICK_REPLY: {
                button.buttons = button.buttons.filter(b => !!b.text && b.text.trim() !== '');
                return !!button?.buttons && button?.buttons?.length ? button : null;
            }
            case ButtonAction.CALL_TO_ACTION: {
                button.buttons = button
                    .buttons
                    .filter(b =>
                        (!!b.phoneNumber && b.phoneNumber.trim() !== '') || (!!b.url && b.url.trim() !== '')
                        && !!b.text && b.text.trim() !== ''
                    );
                return !!button?.buttons && button?.buttons?.length ? button : null;
            }
            default:
                return null;
        }
    }


}
