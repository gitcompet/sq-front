import { HttpHeaders } from '@angular/common/http';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const headers = new HttpHeaders().append(
  'Content-Type',
  'application/json'
);
//.append('content-type', 'text/plain; charset=utf-8')
//.append('content-type', 'application/x-www-form-urlencoded');
export const patchHeaders = new HttpHeaders().append(
  'Content-Type',
  'application/json-patch+json'
);
//.append('content-type', 'text/plain; charset=utf-8')
//.append('content-type', 'application/x-www-form-urlencoded');
export function passwordMatching(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = formGroup.controls['password'].value;
    const confirmPassword = formGroup.controls['confirmPassword'].value;
    return password === confirmPassword ? null : { passwordNotMatch: true };
  };
}
export function passwordMatchingValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}
export function extractName(category: string) {
  const language = category.toLocaleLowerCase().split(' ')[0];
  const name = programmingLanguages
    .filter(
      (lang) =>
        language === lang.abbrv.toLocaleLowerCase() ||
        language === lang.name.toLocaleLowerCase()
    )
    .map((language) => language.name);
  return name;
}
export const programmingLanguages = [
  {
    abbrv: 'JS',
    name: 'javascript',
  },
  {
    abbrv: 'Python',
    name: 'python',
  },
  {
    abbrv: 'Java',
    name: 'java',
  },
  {
    abbrv: 'C#',
    name: 'csharp',
  },
  {
    abbrv: '.NET',
    name: 'dotnetcore',
  },
];

// 'C++',
//   'cplusplus',
//   '.NET',
//   'TypeScript',
//   'Shell',
//   'Bash',
//   'C',
//   'Ruby',
//   'Dotnetcore'
