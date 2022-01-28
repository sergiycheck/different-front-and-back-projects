import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

export function forbiddenPopularityValidator(nameRegExp: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRegExp.test(control.value);
    return forbidden ? { forbiddenValue: { value: control.value } } : null;
  };
}

@Directive({
  selector: '[appForbiddenPopularityValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ForbiddenPopularityValidatorDirective,
      multi: true,
    },
  ],
})
export class ForbiddenPopularityValidatorDirective {
  @Input('appForbiddenPopularityValidator') forbiddenPopularity = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenPopularity
      ? forbiddenPopularityValidator(new RegExp(this.forbiddenPopularity, 'i'))(
          control
        )
      : null;
  }
}
