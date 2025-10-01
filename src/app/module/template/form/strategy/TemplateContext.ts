import {UntypedFormGroup} from '@angular/forms';

export interface TemplateContext {
    form: UntypedFormGroup;
    selectedFile?: File;
}
