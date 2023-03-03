import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-regisration',
  templateUrl: './signup.component.html',
  styles: [],
})
export class SignUpComponent {
  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.authService.formModel.reset();
  }
  onsubmit1() {
    this.authService.register().subscribe(
      (res: any) => {
        if (res.succeded) {
          this.authService.formModel.reset();
          console.log('res:' + res);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onsubmit() {
    this.authService.register().subscribe({
      next: (res) => {
        console.log('res :', res);
        if (res) {
          this.authService.formModel.reset();
        }
      },

      error: (err) => console.log(err),
      complete: () => console.log('completed'),
    });
  }
}
