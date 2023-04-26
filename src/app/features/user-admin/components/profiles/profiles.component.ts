import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { OperationType, Patch } from 'src/app/core/models/patch.model';
import { Subscription, filter } from 'rxjs';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TableComponent } from 'src/app/shared/components/table/table.component';
@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
})
export class ProfilesComponent implements OnInit, AfterViewInit, OnDestroy {
  users: IUser[] = [];
  headers: string[] = [
    'Id',
    'First Name',
    'Last Name',
    'Email',
    'Username',
    'Action',
  ];
  showModal: boolean = false;
  signUpForm: FormGroup;
  updateForm: FormGroup;
  _subscriptions: Subscription[] = [];
  isUrl: boolean = false;
  constructor(
    public authService: AuthService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private modalService: ModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signUpForm = this._formBuilder.group({
      login: new FormControl('', [
        Validators.minLength(3),
        Validators.required,
      ]),
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
    this.updateForm = this._formBuilder.group({
      loginId: new FormControl(),
      login: new FormControl('', [Validators.minLength(3)]),
      email: new FormControl('', [Validators.email]),
      firstName: new FormControl('', [Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.minLength(3)]),
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart)
        this.isUrl = /profiles\d+/.test(this.router.url);
    });

    this._subscriptions.push(
      this.userService.getProfiles().subscribe((res: IUser[]) => {
        this.users = res;
      })
    );
  }
  onAddUser() {
    this.showModal = !this.showModal;
    this.modalService.openModal({
      id: 'addUserModal',
      isShown: this.showModal,
    });
  }
  onUpdateUser(user: IUser) {
    this.updateForm.patchValue(user);
    this.showModal = !this.showModal;
    this.modalService.openModal({
      id: 'updateUserModal',
      isShown: this.showModal,
    });
  }
  onDeleteUser(id: string) {
    this.showModal = !this.showModal;
    this.modalService.updateData(id);
    this.modalService.openModal({
      id: 'confirmationModal',
      isShown: this.showModal,
    });
  }

  moreInfo(user: IUser) {
    const selectedUserUrl = this.router.createUrlTree([user.loginId], {
      relativeTo: this.route,
    });
    this.router.navigateByUrl(selectedUserUrl,{state:{ user : user} });
    this.isUrl = !this.isUrl;
  }

  createUser(form: any) {
    if (!form.valid) return;
    this._subscriptions.push(
      this.authService.signUp(form.value).subscribe((res) => {
        this.users = [...this.users, res];
        this.modalService.closeModal({
          id: 'addUserModal',
          isShown: this.showModal,
        });
      })
    );
  }
  updateUser(form: FormGroup) {
    if (!form.valid) return;
    const controls = form.controls;
    const patches: Patch[] = Object.entries(controls).map((entry) => ({
      path: `/${entry[0]}`,
      op: OperationType.REPLACE,
      value: entry[1].value,
    }));
    this._subscriptions.push(
      this.userService
        .patchUser(controls['loginId'].value, patches)
        .subscribe((res) => {
          this.users = [...this.users, res];
          form.reset();
          this.modalService.closeModal({
            id: 'updateUserModal',
            isShown: this.showModal,
          });
        })
    );
  }
  deleteUser(data: any) {
    if (data.isConfirmed) {
      this._subscriptions.push(
        this.userService.deleteUser(data.userId).subscribe((res) => {
          this.users = this.users.filter(
            (user) => user.loginId !== res.loginId
          );

          this.modalService.closeModal({
            id: 'confirmationModal',
          });
        })
      );
    } else return;
  }
  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}
