import { Component } from '@angular/core';
import { UserService } from 'src/app/features/user-profile/services/user.service';
import { IUser } from 'src/app/core/models/user.model';
import { ModalService } from 'src/app/shared/services/modal.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SignUp } from 'src/app/core/models/signup.model';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { passwordMatchingValidator } from 'src/app/core/constants/settings';
import { from } from 'rxjs';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
})
export class ProfilesComponent {
  users: IUser[] = [];
  headers: string[] = ['First Name', 'Last Name', 'Email', 'Username'];
  showModal: boolean = false;
  signUpForm: FormGroup = this._formBuilder.group({
    login: new FormControl('', [Validators.minLength(3), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    lastName: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.pattern(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
      ),
      passwordMatchingValidator('confirmPassword', true),
      Validators.required,
    ]),
    confirmPassword: new FormControl('', [
      Validators.pattern(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
      ),
      passwordMatchingValidator('password'),
      Validators.required,
    ]),
  } as unknown as SignUp);
  constructor(
    public authService: AuthService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.userService.getProfiles().subscribe((res: IUser[]) => {
      this.users = res;
    });
  }
  onAddUser() {
    this.showModal = !this.showModal;
    this.modalService.openModal({
      id: 'addUserModal',
      isShown: this.showModal,
    });
  }
  createUser(form: any) {
    if (!form.valid) return;
    this.authService.signUp(form.value).subscribe((res) => {
      this.users = [...this.users,res];
      form.reset();
      this.modalService.closeModal({
        id: 'addUserModal',
        isShown: this.showModal,
      });
    });
  }
}
