import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith, tap} from "rxjs/operators";
import {SubscribeService} from "../../services/subscribe.service";

@Component({
  selector: 'jooc-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {

  mainForm!: FormGroup;
  // sub form groups & controls
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;
  phoneCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  // form observable (to react on radio button changes)
  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  // spinner flag
  loading = false;


  constructor(private formBuilder: FormBuilder, private subscribeService: SubscribeService) {
  }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    // form observable
    this.initFormObservables();
  }

  /**
   * init main form that contains all sub form groups
   */
  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });
  }

  /**
   * init sub forms groups & controls that will be grouped in the main form
   */
  private initFormControls(): void {
    // personal info group
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
    this.contactPreferenceCtrl = this.formBuilder.control('email');

    // for email: we create 2 controls & group to easily access them (either by group or single control)
    this.emailCtrl = this.formBuilder.control('');
    this.confirmEmailCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl
    });

    // phone control
    this.phoneCtrl = this.formBuilder.control('');

    // for login info, we create form controls and form group (same as email for better access and management)
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    })
  }


  /**
   * init radio buttons valueChanges
   */
  private initFormObservables() {
    // on change contactPreferenceCtrl => make emailCtrl & confirmMailCtrl required & show them
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value), // this will start once so change is fired by with default value of contactPreferenceCtrl
      map(preference => {
        return preference === 'email';
      }),
      tap(showEmail => this.setEmailValidators(showEmail))
    );

    // when preferenceCtrl is 'phone' => show phone section & make field required, otherwise remove validators
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(preference => {
        return preference === 'phone';
      }),
      tap(showPhone => this.setPhoneValidators(showPhone))
    );
  }

  /**
   * manage emailCtrl & confirmEmailCtrl by adding/removing validators
   * @param showEmailCtrl
   */
  private setEmailValidators(showEmailCtrl: boolean): void {
    if (showEmailCtrl) {
      this.emailCtrl.addValidators([Validators.required, Validators.email]);
      this.confirmEmailCtrl.addValidators([Validators.required, Validators.email])
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
    }
    // always update form control after editing validators
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  /**
   *
   * @param showPhoneCtrl
   */
  private setPhoneValidators(showPhoneCtrl: boolean): void {
    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([Validators.required])
    } else {
      this.phoneCtrl.clearValidators();
    }
    // always update form control
    this.phoneCtrl.updateValueAndValidity();
  }

  /**
   * to check if ctrl has errors & return error message
   * @param ctrl: AbstractControl is either FormGroup or FormControl
   */
  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'This field is required';
    } else if (ctrl.hasError('email')) {
      return 'e-mail is not valid';
    } else if (ctrl.hasError('minLength')) {
      return 'phone number is not long enough';
    } else if (ctrl.hasError('maxLength')) {
      return 'phone number too long';
    } else {
      return 'This field has errors';
    }
  }

  onSubmitForm() {
    console.log(this.mainForm.value);
    this.loading = true;

    this.subscribeService.saveUserInfo(this.mainForm.value).pipe(
      tap(saved => {
        this.loading = false;
        if (saved) {
          this.resetForm();
        } else {
          console.error('subscription failed');
        }
      })
    ).subscribe();
  }

  /**
   * reset main form
   * attention when reset: default values are removed as well => must set them again
   */
  private resetForm(): void {
    this.mainForm.reset();
    // set default value for contactPreferenceCtrl
    this.contactPreferenceCtrl.patchValue('email');
  }
}
