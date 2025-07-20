import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule, CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../entities/customer';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';
import { Country } from '../../entities/country';
import { City } from '../../entities/city';
import { WalletService } from '../../services/wallet.service';
import { CustomerIdentityTypeService } from '../../services/customer-identity-type.service';
import { CustomerIdentityType } from '../../entities/customer-identity-type';
import { DocTypeService } from '../../services/doc-type.service';
import { DocType } from '../../entities/doc-type';
import { CustomerDoc } from '../../entities/customer-doc';
import { CustomerDocService } from '../../services/customer-doc.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { CustomerIdentityService } from '../../services/customer-identity.service';

interface PhoneNumber {
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
  number: string;
  isNumberValid?: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxIntlTelInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  constructor(
    private customerService: CustomerService,
    private countryService: CountryService,
    private cityService: CityService,
    private customerIdentityTypeService: CustomerIdentityTypeService,
    private customerIdenityService: CustomerIdentityService,
    private customerDocService: CustomerDocService,
    private docTypeService: DocTypeService,
    private router: Router) { }

  customer: Customer = new Customer();

  currentStep = 1;
  isLoading: boolean = false;
  isOtpLoading: boolean = false;

  countries: Country[] = [];
  cities: City[] = [];
  files: File[] = []
  customerDocs: CustomerDoc[] = [] // List of customer documents
  identityTypes: CustomerIdentityType[] = []
  docTypes: DocType[] = []
  allowedDocTypes: string[] = []

  errorMessage: string = '';
  successMessage: string = '';
  otpSent: boolean = false;
  otpVerified: boolean = false;
  otpCode: any;
  confirm: string = '';

  selectedCountryCode: string | null = null;

  ngOnInit(): void {
    localStorage.clear()
    this.countryService.getAll().subscribe({
      next: (countries: Country[]) => { this.countries = countries; },
      error: (err) => { console.log(err) }
    });

    this.customerIdentityTypeService.getAll().subscribe({
      next: (identityTypes: CustomerIdentityType[]) => { this.identityTypes = identityTypes; },
      error: (err) => { console.log(err) }
    });

    this.docTypeService.getAll().subscribe({
      next: (docTypes: DocType[]) => {
        this.docTypes = docTypes;
        this.allowedDocTypes = docTypes.map(type => type.dtyIden!)
      },
      error: (err) => { console.log(err) }
    });
  }

  async onSubmit(): Promise<void> {

    const idNumTaken = await this.idNumExists().toPromise();
      if (idNumTaken) {
        return; // Stop if username exists
      }

    // First validate the current step (step 5)
    if (this.currentStep === 5) {
      if (!this.customer.identity!.cidNum || !this.customer.identity!.customerIdentityType || this.files.length <= 0) {
        this.errorMessage = 'Please select an identification type.';
        return;
      }
    }

    this.isLoading = true

    this.customer.role = { id: 1, name: 'CUSTOMER' }

    console.log('Customer data before registration:', this.customer);

    this.customerService.register(this.customer).subscribe({
      next: (customer: Customer) => {

        const customerDocs: CustomerDoc[] = this.customer.identity?.customerDocListe?.customerDocs || [];
        for (let i = 0; i < customerDocs.length; i++) {
          customerDocs[i].customerDocListe = customer.identity?.customerDocListe
          this.customerDocService.create(customerDocs[i], this.files[i]).subscribe({
            next: () => { console.log("docs succ") },
            error: (err) => { console.log(err) }
          })
        }
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'Registration failed. Please try again.\n';
        this.successMessage = '';
      },
    });
    this.isLoading = false
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file => {
        const matchedDocType = this.docTypes.find(dt => dt.dtyIden === file.type)

        this.customerDocs.push(new CustomerDoc({
          cdoLabe: file.name,
          docType: matchedDocType,
        }))
        this.files.push(file)
      }))
    }
  }


  usernameExists(): Observable<boolean> {
    if (!this.customer.username)
      return of(false)
    return this.customerService.existsByUsername(this.customer.username).pipe(
      tap(response => {
        if (response)
          this.errorMessage = 'username already in use.'
        else this.errorMessage = ''
      }),
      catchError(err => { console.log(err.message); return of(false) })
    );
  }

  phoneExists(): Observable<boolean> {
    if (!this.customer.cusPhoneNbr)
      return of(false)
    return this.customerService.existsByPhone(this.customer.cusPhoneNbr).pipe(
      tap(response => {
        if (response)
          this.errorMessage = 'phone number already in use.'
        else this.errorMessage = ''
      }),
      catchError(err => { console.log(err.message); return of(false) })
    );
  }

  idNumExists(): Observable<boolean> {
    if (!this.customer.identity?.cidNum)
      return of(false)
    return this.customerIdenityService.existsByCidNum(this.customer.identity?.cidNum).pipe(
      tap(response => {
        if (response)
          this.errorMessage = 'ID Num already in use.'
        else this.errorMessage = ''
      }),
      catchError(err => { console.log(err.message); return of(false) })
    );
  }

  async goToNextStep() {

    // Step 1: Validate Full Name and Username
    if (this.currentStep === 1) {
      if (!this.customer.cusFirstName?.trim() || !this.customer.cusLastName?.trim() || !this.customer.username?.trim()) {
        this.errorMessage = 'Please fill in both Full Name and Username.';
        return;
      }

      // Async username check
      const usernameTaken = await this.usernameExists().toPromise();
      if (usernameTaken) {
        return; // Stop if username exists
      }
    }

    // Step 2: location and phone number validation
    if (this.currentStep === 2) {
      if (!this.customer.cusAddress?.trim() || !this.customer.country || !this.customer.city) {
        this.errorMessage = 'Please provide you address.';
        return;
      }
      const phoneControl = this.phoneForm.get('phone');

      if (!phoneControl?.value) {
        this.errorMessage = 'Please enter a phone number.';
        return;
      }

      // Check if the control is invalid
      if (phoneControl.invalid) {
        this.errorMessage = 'Please enter a valid phone number.';
        return;
      }

      const phoneValue = phoneControl.value as PhoneNumber;
      this.customer.cusPhoneNbr = phoneValue.e164Number;

      // Async phone check
      //const phoneTaken = await this.phoneExists().toPromise();
      if (await this.phoneExists().toPromise()) {
        return; // Stop if username exists
      }
    }

    // Step 3: email validation
    if (this.currentStep === 3) {

      if (!this.customer.cusMailAddress?.trim() || !this.otpVerified) {
        this.errorMessage = 'Please enter and verify your email.';
        return;
      }
    }

    // Step 4: Validate Email and Password
    if (this.currentStep === 4) {
      if (this.customer.cusMotDePasse!.length < 6 || !this.customer.cusMotDePasse?.trim() || this.customer.cusMotDePasse != this.confirm) {
        this.errorMessage = 'Please enter your password.';
        return;
      }
    }

    // Clear any previous error and go to the next step
    this.successMessage = ""
    this.errorMessage = '';
    this.currentStep++;
  }

  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  onCountryChange(): void {
    this.cityService.getByCountry(this.customer.country!).subscribe({
      next: (cities: City[]) => {
        this.cities = cities;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  phoneForm = new FormGroup({
    phone: new FormControl<PhoneNumber | null>(null, [
      Validators.required,
      this.validatePhoneNumber
    ])
  });


  // Custom phone number validator
  private validatePhoneNumber(control: AbstractControl) {
    const phoneValue = control.value as PhoneNumber | null;
    if (!phoneValue) {
      return { required: true };
    }
    if (!phoneValue.e164Number) {
      return { invalidFormat: true };
    }
    if (phoneValue.isNumberValid === false) {
      return { invalidNumber: true };
    }
    return null;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  sendOtp() {
    if (!this.customer.cusMailAddress) {
      console.error('Email address is required');
      return;
    }

    this.isOtpLoading = true

    this.customerService.sendEmail(this.customer.cusMailAddress, "TOTP").subscribe({
      next: (result: any) => {
        console.log('OTP sent result:', result.message);
        if (result.message != 'success')
          this.errorMessage = result.message || 'Failed to send OTP. Please try again.';
        else {
          this.successMessage = 'OTP sent successfully.';
          this.otpSent = true;
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to send OTP. Please try again.';
        console.error('OTP mailing Failed: ', err);
      },
      complete: () => {
        this.isOtpLoading = false; // Hide loading indicator after completion
      }
    });
  }

  verifyOtp() {

    if (!this.customer.cusMailAddress) {
      console.error('Email address is required');
      return;
    }

    this.customerService.verifyOTP(this.customer.cusMailAddress, this.otpCode).subscribe({
      next: (verif: boolean) => {
        this.otpVerified = verif; // Direct assignment (no .valueOf needed)
        console.log('OTP Verification Result:', verif);

        if (!verif)
          this.errorMessage = 'OTP verification failed. Please try again.';
        else {
          this.errorMessage = '';
          this.successMessage = 'OTP verified successfully!';
        }
      },
      error: (err) => {
        console.error('OTP Verification Failed:', err);
        this.errorMessage = 'OTP verification failed. Please try again.\n' + err.message;
        // Handle errors (e.g., show error message)
      }
    });
  }
}
