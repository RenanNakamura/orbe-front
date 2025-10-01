import { TemplateContext } from './TemplateContext';

export declare interface CreateTemplateStrategy {
    execute(context: TemplateContext): Promise<void>;
}
