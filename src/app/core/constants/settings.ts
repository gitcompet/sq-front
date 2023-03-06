import { HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  // .set('Access-Control-Allow-Origin', '*')
  // .set('Access-Control-Allow-Origin', 'http://localhost:4200')
  .append('content-type', 'text/plain; charset=utf-8')
  .append('content-type', 'application/x-www-form-urlencoded');

export function passwordMatching(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
     const password = formGroup.controls['password'].value;
     const confirmPassword = formGroup.controls['confirmPassword'].value;
     return password === confirmPassword ? null : {passwordNotMatch : true};
  }
}
