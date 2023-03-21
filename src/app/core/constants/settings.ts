import { HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const headers = new HttpHeaders()
  .append('Content-Type', 'application/json')
  //.append('content-type', 'text/plain; charset=utf-8')
  //.append('content-type', 'application/x-www-form-urlencoded');
export function passwordMatching(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
     const password = formGroup.controls['password'].value;
     const confirmPassword = formGroup.controls['confirmPassword'].value;
     return password === confirmPassword ? null : {passwordNotMatch : true};
  }
}
export function passwordMatchingValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl):
  ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value ===
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}
