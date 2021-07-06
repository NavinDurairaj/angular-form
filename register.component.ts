import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CountryService } from '../country.service';
import { Country } from '../country';
import { State } from '../state';
import { UserServiceService } from '../user-service.service';
import { MustMatch } from '../must-match.validatior';
import { Router } from '@angular/router';
import { User } from '../model/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  /*providers: [CountryService]*/
})
export class RegisterComponent implements OnInit {

  Data: Array<any> = [
    { name: 'Tamil', value: 'tamil' },
    { name: 'English', value: 'english' },
    { name: 'Malayalam', value: 'malayalam' },
    { name: 'French', value: 'french' },
    { name: 'Telugu', value: 'telugu' }
  ];

  selectedCountry: Country = new Country(0, '');
  countries: Country[];
  states: State[];
  maxChars = 200;
  role = '';
  chars = 0;

  title = 'angular-form';
  checkoutForm: FormGroup;
  //  user: any = {};  local
  user!: User;
  /*countryService: any;*/

  constructor(private formBuilder: FormBuilder, private countryService: CountryService, private userService: UserServiceService, 
    private fb: FormBuilder, private router: Router) {
    this.countries = this.countryService.getCountries();
    this.states = this.countryService.getStates();

    this.checkoutForm = formBuilder.group({
      checkArray: this.fb.array([], [Validators.required]),
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      birthdate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      gender: ['', [Validators.required]],               
      aboutme: ['', [Validators.minLength(10), Validators.maxLength(200)]],
      language: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city:['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
}

  onSubmit() { 
    console.log(this.checkoutForm.value);
    //this.user = Object.assign(this.user, this.checkoutForm.value); //local
    this.addUser(this.userData()); //local
    //this.checkoutForm.reset();
    this.router.navigate(['/logout']);
}     

  userData(): User {
    return this.user = {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
      aboutMe: this.aboutMe.value,
      address1: this.address1.value,
      address2: this.address2.value,
      city: this.city.value,
    }
  }

  get firstName() {
    return this.checkoutForm.get('firstName') as FormControl;
  }

  get lastName() {
    return this.checkoutForm.get('lastName') as FormControl;
  }

  get email() {
    return this.checkoutForm.get('email') as FormControl;
  }

  get password() {
    return this.checkoutForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.checkoutForm.get('confirmPassword') as FormControl;
  }

  get aboutMe() {
    return this.checkoutForm.get('aboutMe') as FormControl;
  }

  get address1() {
    return this.checkoutForm.get('address1') as FormControl;
  }

  get address2() {
    return this.checkoutForm.get('address2') as FormControl;
  }

  get city() {
    return this.checkoutForm.get('city') as FormControl;
  }

  ngOnInit(): void {
    this.countries = this.countryService.getCountries();
    this.onSelect(this.selectedCountry.id);
  }

  onSelect(countryid:any) { 
    this.states = this.countryService.getStates().filter((item) => item.countryid == countryid);
  }
  
  addUser(user: User) {
    let users: any[] = [];
    if(localStorage.getItem('Users')) {
      users = JSON.parse(localStorage.getItem('Users') || '{}')
      users = [user, ...users];
    } else {
      users = [user];
    }
    localStorage.setItem('Users', JSON.stringify(users));
  }

  onCheckboxChange(e:any) {
    const checkArray: FormArray = this.checkoutForm.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }


}
