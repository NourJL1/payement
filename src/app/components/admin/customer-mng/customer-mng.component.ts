import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../../services/country.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Customer, CustomerService } from '../../../services/customer.service';
import { CustomerStatusService } from '../../../services/customer-status.service';
import { CustomerStatus } from '../../../entities/customer-status';
import { City } from '../../../entities/city';
import { CustomerIdentityType } from '../../../entities/customer-identity-type';
import { CityService } from '../../../services/city.service';
import { CustomerIdentityTypeService } from '../../../services/customer-identity-type.service';
import { Country } from '../../../entities/country';
import { DocType } from '../../../entities/doc-type';
import { DocTypeService } from '../../../services/doc-type.service';
import { CustomerDoc } from '../../../entities/customer-doc';
import { CustomerDocService } from '../../../services/customer-doc.service';
import { WalletCategory } from '../../../entities/wallet-category';
import { WalletCategoryService } from '../../../services/wallet-category.service';
import { WalletTypeService } from '../../../services/wallet-type.service';
import { WalletType } from '../../../entities/wallet-type';
import { catchError, Observable, of, tap } from 'rxjs';
import { CustomerIdentityService } from '../../../services/customer-identity.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AuthService } from '../../../services/auth.service';
import { Router } from "@angular/router";

interface PhoneNumber {
  number?: string;
  internationalNumber?: string;
  nationalNumber?: string;
  e164Number?: string;
  countryCode?: string;
  dialCode?: string;
  isNumberValid?: boolean;
}

@Component({
  selector: 'app-customer-mng',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule],
  templateUrl: './customer-mng.component.html',
  styleUrl: './customer-mng.component.css'
})
export class CustomerMngComponent {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private customerService: CustomerService,
    private customerStatusService: CustomerStatusService,
    private customerIdentityTypeService: CustomerIdentityTypeService,
    private customerIdentityService: CustomerIdentityService,
    private customerDocService: CustomerDocService,
    private docTypeService: DocTypeService,
    private countryService: CountryService,
    private cityService: CityService,
    private walletCategoryService: WalletCategoryService,
    private walletTypeService: WalletTypeService,
    private cdr: ChangeDetectorRef,
    private router: Router) { }

  isAddCustomerVisible: boolean = false;
  isUserDetailsVisible: boolean = false;
  isCustomerStatusVisible: boolean = false;
  isCustomerIdentityTypeVisible: boolean = false;
  isDocTypeVisible: boolean = false;
  isCountryVisible: boolean = false;
  isCityVisible: boolean = false;

  countries: Country[] = [] // List of countries from db
  filteredCountries: Country[] = [] // Filtered list of countries

  cities: City[] = [] // List of all cities from db
  filteredCities: City[] = []
  citiesByCountry: City[] = [] // List of cities from db by countries

  allCustomers: Customer[] = [] // List of all customers
  filteredCustomers: Customer[] = [] // Filtered list of customers

  statuses: CustomerStatus[] = [] // List of customer statuses
  filteredStatuses: CustomerStatus[] = [] // Filtered list of customer statuses

  identityTypes: CustomerIdentityType[] = [] // List of customer identity types
  filteredIdentityTypes: CustomerIdentityType[] = [] // Filtered list of customer identity types

  docTypeList: DocType[] = [] // List of document types not in db
  filteredDocTypes: DocType[] = [] // Filtered list of document types


  // Selected items for editing
  selectedCustomer?: Customer
  selectedStatus?: CustomerStatus
  selectedIdentityType?: CustomerIdentityType
  selectedDoc?: CustomerDoc
  selectedDocType?: DocType;
  selectedCountry?: Country
  selectedCity?: City

  // Forms for adding/editing
  customerForm: Customer = new Customer()
  statusForm: CustomerStatus = new CustomerStatus()
  identityTypeForm: CustomerIdentityType = new CustomerIdentityType()
  docTypeForm: DocType = new DocType;
  countryForm: Country = new Country()
  cityForm: City = new City()

  docTypes: DocType[] = [] // List of document types not in db
  countryList: Country[] = [] // List of countries not in db
  cityList: String[] = [] // List of cities not in db

  successMessage: string | null = null;
  errorMessage: string | null = null;

  files: File[] = []
  customerDocs: CustomerDoc[] = [] // List of customer documents

  confirmPassword?: String

  allowedDocTypes: string[] = [] // List of allowed document types

  customerSearchTerm?: string;
  statusSearchTerm?: string;
  idTypeSearchTerm?: string
  docTypeSearchTerm?: string
  countrySearchTerm?: string
  citySearchTerm?: string

  walletCategories?: WalletCategory[]
  walletTypes?: WalletType[]


  ngOnInit(): void {
    if (history.state?.customerToEdit) {  // <-- Check history.state
      const customer = history.state.customerToEdit as Customer;
      this.editCustomer(customer);
      history.replaceState({}, '');  // <-- This removes the customerToEdit from history
    }
    this.loadAllCustomers()
    this.loadIdentityTypes()
    this.loadDocTypes()
    this.loadCountries()
    this.loadCities()
    /* this.loadWalletStatuses();
    this.loadWalletCategories();
    this.loadWalletTypes(); */
  }

  loadAllCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (customers: Customer[]) => { this.allCustomers = customers; this.filteredCustomers = customers },
      error: (err) => { console.log(err) }
    })

    this.customerStatusService.getAll().subscribe({
      next: (statuses: CustomerStatus[]) => { this.statuses = statuses; this.filteredStatuses = statuses },
      error: (err) => { console.log(err) }
    })
  }

  loadIdentityTypes() {
    this.customerIdentityTypeService.getAll().subscribe({
      next: (types: CustomerIdentityType[]) => { this.identityTypes = types; this.filteredIdentityTypes = types },
      error: (err) => { console.log(err) }
    })
  }

  loadDocTypes() {
    this.docTypeService.getAll().subscribe({
      next: (types: DocType[]) => {
        this.docTypes = types
        this.filteredDocTypes = types
        this.http.get<any>('assets/documentTypes.json')
          .subscribe((response) => {
            const allDocTypes: DocType[] = response.documentTypes
            this.docTypeList = allDocTypes.filter((docType: DocType) => !this.docTypes.some(dty => dty.dtyIden === docType.dtyIden))
            //this.filteredDocTypes = this.docTypes
            this.allowedDocTypes = this.docTypes.map(type => type.dtyIden!)
          });
      },
      error: (err) => { console.log(err) }
    })
  }

  loadCountries() {
    this.countryService.getAll().subscribe({
      next: (countries: Country[]) => {
        this.countries = countries
        this.filteredCountries = countries
        this.http.get<any>('https://countriesnow.space/api/v0.1/countries')
          .subscribe((response) => {
            const allCountries: Country[] = response.data.map((item: any) => ({
              ctrIden: item.iso2,  // Using ISO2 code as identifier
              ctrLabe: item.country // Using country name as label
            }))
            this.countryList = allCountries.filter((country: Country) => !this.countries.some(ctr => ctr.ctrIden === country.ctrIden))
          });
      },
      error: (err) => { console.log(err) }
    })
  }

  loadCities() {
    this.cityService.getAll().subscribe({
      next: (cities: City[]) => { this.cities = cities; this.filteredCities = cities; this.filteredCities = cities },
      error: (err) => { console.log(err) }
    })
  }

  // Load wallet categories
  loadWalletCategories(): void {
    this.errorMessage = null;
    this.walletCategoryService.getAll().subscribe({
      next: (categories: WalletCategory[]) => {
        this.walletCategories = categories;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallet categories: ${error.status} ${error.statusText}` : 'Failed to load wallet categories: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallet categories:', error);
      }
    });
  }

  // Load wallet types
  loadWalletTypes(): void {
    this.errorMessage = null;
    this.walletTypeService.getAll().subscribe({
      next: (types: WalletType[]) => {
        this.walletTypes = types;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        const message = error.status ? `Failed to load wallet types: ${error.status} ${error.statusText}` : 'Failed to load wallet types: Server error';
        this.showErrorMessage(message);
        console.error('Error loading wallet types:', error);
      }
    });
  }

  compareBy(prop: keyof any) {
    return (a: any, b: any) => a?.[prop] === b?.[prop];
  }

  // customer methods

  editCustomer(customer: Customer) {
    this.selectedCustomer = customer
    this.customerForm = { ...customer, fullName: customer.fullName }

    const phone = customer.cusPhoneNbr!
    this.phoneForm.get('phone')!.setValue(phone);

    console.log(this.phoneForm.get('phone')?.value)

    this.onCountryChange(customer.country!);
    this.customerDocs = []
    this.files = []
    this.isAddCustomerVisible = true;
    //(document.getElementById("phoneRef") as HTMLDivElement).innerHTML = ''
    this.cdr.detectChanges();
  }

  addCustomer() {
    const emailRef = document.getElementById("emailRef") as HTMLDivElement
    const phoneRef = document.getElementById("phoneRef") as HTMLDivElement
    const usernameRef = document.getElementById("usernameRef") as HTMLDivElement
    const idNumRef = document.getElementById("idNumRef") as HTMLDivElement
    if (usernameRef.innerHTML || phoneRef.innerHTML || emailRef.innerHTML || idNumRef.innerHTML) {
      this.showErrorMessage("Some fields are already in use!")
      return
    }
    if (this.customerForm.cusMotDePasse != this.confirmPassword) {
      this.showErrorMessage("Passwords mismatch!")
      return
    }

    const confirmRef = document.getElementById("confirm") as HTMLDivElement

    this.customerService.register(this.customerForm).subscribe({
      next: (customer: Customer) => {
        console.log('add Customer: cus added:', customer);
        for (let i = 0; i < this.customerDocs.length; i++) {
          this.customerDocs[i].customerDocListe = customer.identity?.customerDocListe
          this.customerDocService.create(this.customerDocs[i], this.files[i]).subscribe({
            next: () => { console.log("docs succ") },
            error: (err) => { console.log(err) }
          })
        }
        this.allCustomers.push(customer);
        //this.filteredCustomers.push(customer)
        this.customerForm = new Customer();
        this.citiesByCountry = [];
        this.files = [];
        this.confirmPassword = ''
        this.isAddCustomerVisible = false;
        this.showSuccessMessage('Customer added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add Customer: Error:', err);
        this.showErrorMessage('Failed to add customer: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateCustomer() {
    const emailRef = document.getElementById("emailRef") as HTMLDivElement
    const phoneRef = document.getElementById("phoneRef") as HTMLDivElement
    //const usernameRef = document.getElementById("usernameRef") as HTMLDivElement
    if (/* usernameRef.innerHTML ||  */phoneRef.innerHTML || emailRef.innerHTML) {
      this.showErrorMessage("Some fields are already in use!")
      return
    }

    this.customerService.updateCustomer(this.customerForm.cusCode!, this.customerForm).subscribe({
      next: (customer: Customer) => {
        const index = this.allCustomers.findIndex(cus => cus.cusCode === this.customerForm.cusCode);
        if (index !== -1) {
          this.allCustomers[index] = customer;
          this.allCustomers = this.allCustomers;
        }
        this.customerForm = new Customer();
        this.selectedCustomer = undefined;
        this.citiesByCountry = [];
        this.files = [];
        this.confirmPassword = ''
        this.isAddCustomerVisible = false;
        this.showSuccessMessage('Customer updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('update Customer: Error:', err);
        this.showErrorMessage('Failed to update customer: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  onFileSelected(event: Event): void {
    const maxFileSize = 10 * 1024 * 1024;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file => {
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" exceeds the maximum size of 10MB.`);
          return; // Skip this file
        }
        const matchedDocType = this.docTypes.find(dt => dt.dtyIden === file.type)

        this.customerDocs.push(new CustomerDoc({
          cdoLabe: file.name,
          docType: matchedDocType,
        }))
        this.files.push(file)
      }))
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customer.cusCode!).subscribe({
        next: () => {
          this.allCustomers = this.allCustomers.filter(cus => cus.cusCode !== customer?.cusCode);
          this.filteredCustomers = this.filteredCustomers.filter(cus => cus.cusCode !== customer?.cusCode);
          this.showSuccessMessage('Customer deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  filterCustomers() {
    if (!this.selectedStatus && !this.selectedCountry && !this.selectedCity && !this.customerSearchTerm)
      this.loadAllCustomers()
    else {
      this.filteredCustomers = this.allCustomers.filter(customer => {
        return (!this.selectedStatus || customer.status?.ctsCode === this.selectedStatus?.ctsCode) &&
          (!this.selectedCountry || customer.country?.ctrCode === this.selectedCountry?.ctrCode) &&
          (!this.selectedCity || customer.city?.ctyCode === this.selectedCity?.ctyCode)
      })
    }
    if (this.customerSearchTerm) {
      this.customerService.search(this.customerSearchTerm).subscribe({
        next: (searchResults: Customer[]) => {
          this.filteredCustomers = searchResults.filter(searchedCustomer =>
            this.filteredCustomers.some(localCustomer => localCustomer.cusCode === searchedCustomer.cusCode)
          );
          //this.filteredWallets = this.filteredWallets.filter(wallet => {return searchResults.some(sr => sr.walCode === wallet.walCode)});
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to search wallets: ${error.status} ${error.statusText}` : 'Failed to search wallets: Server error';
          this.showErrorMessage(message);
          console.error('Error searching wallets:', error);
        }
      })
    }
  }

  usernameExists() {
    if (!this.customerForm.username)
      return
    return this.authService.existsByUsername(this.customerForm.username).subscribe({
      next: (response) => {
        const fieldRef = document.getElementById("usernameRef") as HTMLDivElement
        fieldRef.innerHTML = response ? 'Username already in use' : '';
      },
      error: (err) => { console.log(err.message); return of(false) }
    });
  }

  phoneExists() {
    const fieldRef = document.getElementById("phoneRef") as HTMLDivElement
    const phoneControl = this.phoneForm.get('phone');

    if (!phoneControl?.value) {
      fieldRef.innerHTML = ('Please enter a phone number.')
      return;
    }

    // Check if the control is invalid
    if (phoneControl.invalid) {
      fieldRef.innerHTML = ('Please enter a valid phone number.')
      return;
    }

    const phoneValue = phoneControl.value as PhoneNumber;
    this.customerForm.cusPhoneNbr = phoneValue.e164Number as string;

    //console.log(phoneValue)

    if (!this.customerForm.cusPhoneNbr || this.customerForm.cusPhoneNbr == this.selectedCustomer?.cusPhoneNbr)
      return
    return this.authService.existsByPhone(this.customerForm.cusPhoneNbr).subscribe({
      next: (response) => {
        fieldRef.innerHTML = (this.selectedCustomer?.cusPhoneNbr != this.customerForm.cusPhoneNbr && response) ? 'Phone number already in use' : '';
      },
      error: (err) => { console.log(err.message); return of(false) }
    });
  }

  emailExists() {
    if (!this.customerForm.cusMailAddress)
      return
    return this.authService.existsByEmail(this.customerForm.cusMailAddress).subscribe({
      next: (response) => {
        const fieldRef = document.getElementById("emailRef") as HTMLDivElement
        fieldRef.innerHTML = (this.selectedCustomer?.cusMailAddress != this.customerForm.cusMailAddress && response) ? 'Email already in use' : '';
      },
      error: (err) => { console.log(err.message); return of(false) }
    });
  }

  idNumExists() {
    if (!this.customerForm.identity?.cidNum)
      return
    return this.customerIdentityService.existsByCidNum(this.customerForm.identity.cidNum).subscribe({
      next: (response) => {
        const fieldRef = document.getElementById("idNumRef") as HTMLDivElement
        fieldRef.innerHTML = response ? 'ID Num already in use' : '';
      },
      error: (err) => { console.log(err.message); return of(false) }
    });
  }

  // ======================
  // PHONE NUMBER RELATED CODE
  // ======================

  // Phone Form Control
  phoneForm = new FormGroup({
    phone: new FormControl()//<PhoneNumber | null>(null)
  });

  // Custom phone number validator
  /*   private validatePhoneNumber(control: AbstractControl) {
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
    } */

  // status methods

  editStatus(status: CustomerStatus) {
    this.selectedStatus = status
    this.statusForm = { ...status }
    this.isCustomerStatusVisible = true
    this.cdr.detectChanges();
  }

  addStatus() {
    this.customerStatusService.create(this.statusForm).subscribe({
      next: (status: CustomerStatus) => {
        console.log('add Customer Status: status added:', status);
        this.statuses.push(status);
        this.statusForm = new CustomerStatus();
        this.isCustomerStatusVisible = false;
        this.showSuccessMessage('Customer Status added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add Customer Staus: Error:', err);
        this.showErrorMessage('Failed to add customer status: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateStatus() {
    this.customerStatusService.update(this.statusForm.ctsCode!, this.statusForm).subscribe({
      next: (status: CustomerStatus) => {
        console.log('update status: status updated:', this.statusForm);
        const index = this.statuses.findIndex(cts => cts.ctsCode === this.statusForm.ctsCode);
        if (index !== -1) {
          this.statuses[index] = status;
          this.statuses = [...this.statuses];
        }
        this.statusForm = new CustomerStatus();
        this.selectedStatus = undefined;
        this.isCustomerStatusVisible = false;
        this.showSuccessMessage('status updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('updateStatus: Error:', err);
        this.showErrorMessage('Failed to update status: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteStatus(status: CustomerStatus) {
    if (confirm('Are you sure you want to delete this customer status?')) {
      this.customerStatusService.delete(status.ctsCode!).subscribe({
        next: () => {
          console.log("deleted succ")
          this.statuses = this.statuses.filter(cts => cts.ctsCode !== status?.ctsCode);
          this.filteredStatuses = this.filteredStatuses.filter(cts => cts.ctsCode !== status?.ctsCode);
          this.showSuccessMessage('Customer Status deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  statusSearch() {
    if (!this.statusSearchTerm)
      this.filteredStatuses = this.statuses
    else {
      this.customerStatusService.search(this.statusSearchTerm).subscribe({
        next: (searchResults: CustomerStatus[]) => {
          this.filteredStatuses = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search wallet statuses: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  // identity type methods

  editIdentityType(identityType: CustomerIdentityType) {
    this.selectedIdentityType = identityType
    this.identityTypeForm = { ...identityType }
    this.isCustomerIdentityTypeVisible = true
    this.cdr.detectChanges();
  }

  addIdentityType() {
    this.customerIdentityTypeService.create(this.identityTypeForm).subscribe({
      next: (identityType: CustomerIdentityType) => {
        console.log('add Customer Identity Type: identity added:', identityType);
        this.identityTypes.push(identityType);
        this.identityTypeForm = new CustomerIdentityType();
        this.isCustomerIdentityTypeVisible = false;
        this.showSuccessMessage('Customer identity type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add Customer identity type: Error:', err);
        this.showErrorMessage('Failed to add customer identity type: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateIdentityType() {
    this.customerIdentityTypeService.update(this.identityTypeForm.citCode!, this.identityTypeForm).subscribe({
      next: (identityType: CustomerIdentityType) => {
        console.log('update identity type: identity type updated:', this.identityTypeForm);
        const index = this.identityTypes.findIndex(cit => cit.citCode === this.identityTypeForm.citCode);
        if (index !== -1) {
          this.identityTypes[index] = identityType;
          this.identityTypes = [...this.identityTypes];
        }
        this.identityTypeForm = new CustomerIdentityType();
        this.selectedIdentityType = undefined;
        this.isCustomerIdentityTypeVisible = false;
        this.showSuccessMessage('identity type updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('updateIdentityType: Error:', err);
        this.showErrorMessage('Failed to update identity type: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteIdentityType(identityType: CustomerIdentityType) {
    if (confirm('Are you sure you want to delete this identity type?')) {
      this.customerIdentityTypeService.delete(identityType.citCode!).subscribe({
        next: () => {
          console.log("deleted succ")
          this.identityTypes = this.identityTypes.filter(cit => cit.citCode !== identityType?.citCode);
          this.filteredIdentityTypes = this.filteredIdentityTypes.filter(cit => cit.citCode !== identityType?.citCode);
          this.showSuccessMessage('Customer identity type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  idTypeSearch() {
    if (!this.idTypeSearchTerm)
      this.filteredIdentityTypes = this.identityTypes
    else {
      this.customerIdentityTypeService.search(this.idTypeSearchTerm).subscribe({
        next: (searchResults: CustomerIdentityType[]) => {
          this.filteredIdentityTypes = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search wallet statuses: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  // doc type methods

  editDocType(docType: DocType) {
    this.selectedDocType = docType
    this.docTypeForm = { ...docType }
    this.isDocTypeVisible = true
    this.cdr.detectChanges();
  }

  addDocType() {
    console.log(this.identityTypeForm)
    this.docTypeService.create(this.docTypeForm).subscribe({
      next: (docType: DocType) => {
        console.log('add Doc Type: identity added:', docType);

        // 1. Add to DB list and filtered list
        this.docTypes.push(docType);
        //this.filteredDocTypes.push(docType);

        // 2. Add to allowed types (if needed)
        this.allowedDocTypes.push(docType.dtyIden!);

        // 3. Remove from non-DB list (docTypeList)
        this.docTypeList = this.docTypeList.filter(
          item => item.dtyIden !== docType.dtyIden
        );

        this.isDocTypeVisible = false;
        this.showSuccessMessage('Document type added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add document type: Error:', err);
        this.showErrorMessage('Failed to add document type: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  deleteDocType(docType: DocType) {
    if (confirm('Are you sure you want to delete this document type?')) {
      this.docTypeService.delete(docType.dtyCode!).subscribe({
        next: () => {
          this.docTypes = this.docTypes.filter(dty => dty.dtyCode !== docType?.dtyCode);
          this.filteredDocTypes = this.filteredDocTypes.filter(dty => dty.dtyCode !== docType?.dtyCode);
          this.allowedDocTypes = this.docTypes
            .filter(dty => dty.dtyIden !== docType?.dtyIden)
            .map(dty => dty.dtyIden!);
          this.showSuccessMessage('Document Type deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  docTypeSearch() {
    if (!this.docTypeSearchTerm)
      this.filteredDocTypes = this.docTypes
    else {
      this.docTypeService.search(this.docTypeSearchTerm).subscribe({
        next: (searchResults: DocType[]) => {
          this.filteredDocTypes = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search document types: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  // country methods

  addCountry() {
    this.countryService.create(this.countryForm).subscribe({
      next: (country: Country) => {
        console.log('add country: country added:', country);
        this.countries.push(country);
        this.countryForm = new Country();
        this.isCountryVisible = false;
        this.showSuccessMessage('Country added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add country: Error:', err);
        this.showErrorMessage('Failed to add country: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  deleteCountry(country: Country) {
    if (confirm('Are you sure you want to delete this country?')) {
      this.countryService.delete(country.ctrCode!).subscribe({
        next: () => {
          console.log("deleted succ")
          this.countries = this.countries.filter(ctr => ctr.ctrCode !== country.ctrCode);
          this.filteredCountries = this.filteredCountries.filter(ctr => ctr.ctrCode !== country.ctrCode);
          this.showSuccessMessage('Country deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  countrySearch() {
    if (!this.countrySearchTerm)
      this.filteredCountries = this.countries
    else {
      this.countryService.search(this.countrySearchTerm).subscribe({
        next: (searchResults: Country[]) => {
          console.log('search results:', searchResults);
          this.filteredCountries = searchResults;
          console.log('filtered countries:', this.filteredCountries);
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search countries: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  //city methods

  addCity() {
    this.cityService.create(this.cityForm).subscribe({
      next: (city: City) => {
        this.cities.push(city);
        this.cityForm = new City();
        this.isCityVisible = false;
        this.showSuccessMessage('City added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('add city: Error:', err);
        this.showErrorMessage('Failed to add city: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  deleteCity(city: City) {
    if (confirm('Are you sure you want to delete this city?')) {
      this.cityService.delete(city.ctyCode!).subscribe({
        next: () => {
          this.cities = this.cities.filter(cty => cty !== city.ctyCode);
          this.filteredCities = this.filteredCities.filter(cty => cty !== city.ctyCode);
          this.showSuccessMessage("deleted succ");
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  onCountryChange(country: Country): void {
    if (!country) {
      this.citiesByCountry = [];
      return;
    }
    this.cityService.getByCountry(country).subscribe(
      {
        next: (cities: City[]) => {
          this.citiesByCountry = cities;
        },
        error: (err) => {
          console.log(err)
        }
      }
    );
  }

  onAllCountryChange(): void {
    this.http.post("https://countriesnow.space/api/v0.1/countries/cities", { country: this.cityForm.country?.ctrLabe }).subscribe({
      next: (response: any) => {
        const allCities = response.data.filter((city: string) => !this.cities.some(cty => cty.ctyLabe === city))
        this.cityList = allCities.filter((city: City) => !this.cities.some(cty => cty.ctyLabe === city.ctyLabe))
      },
      error: (err) => { console.log(err) }
    })
  }

  filterCities() {
    if (!this.selectedCountry && !this.citySearchTerm)
      this.loadCities()
    else {
      this.filteredCities = this.cities.filter(city => {
        return (!this.selectedCountry || city.country?.ctrCode === this.selectedCountry?.ctrCode)
      })
    }
    if (this.citySearchTerm) {
      this.cityService.search(this.citySearchTerm).subscribe({
        next: (searchResults: City[]) => {
          this.filteredCities = searchResults.filter(searchedCity =>
            this.filteredCities.some(localCity => localCity.ctyCode === searchedCity.ctyCode)
          );
          //this.filteredWallets = this.filteredWallets.filter(wallet => {return searchResults.some(sr => sr.walCode === wallet.walCode)});
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to search wallets: ${error.status} ${error.statusText}` : 'Failed to search wallets: Server error';
          this.showErrorMessage(message);
          console.error('Error searching wallets:', error);
        }
      })
    }
  }

  // html methods

  toggleForm(modal: string) {
    switch (modal) {
      case 'customer-add':
        this.selectedCustomer = undefined;
        this.customerForm = new Customer()
        this.isAddCustomerVisible = true;
        break;
      case 'customer-details':
        this.isUserDetailsVisible = true;
        this.customerDocService.getByCustomerDocListe(this.selectedCustomer?.identity?.customerDocListe?.cdlCode!).subscribe({
          next: (docs: CustomerDoc[]) => {
            this.selectedCustomer!.identity!.customerDocListe!.customerDocs = docs
            this.cdr.detectChanges();
          }
          /* next: (docs: any) => {
            this.selectedCustomer!.identity!.customerDocListe!.customerDocs = [];
            this.files = [];
            docs.forEach((doc: any) => {
              this.selectedCustomer?.identity?.customerDocListe?.customerDocs?.push(doc.customerDoc)
              this.files.push(doc.file);
            })
            this.cdr.detectChanges();
          } */,
          error: (err) => { console.log(err) }
        })
        break;
      case 'customer-status':
        this.selectedStatus = undefined;
        this.statusForm = new CustomerStatus()
        this.isCustomerStatusVisible = true;
        break;
      case 'customer-identityType':
        this.selectedIdentityType = undefined
        this.identityTypeForm = new CustomerIdentityType()
        this.isCustomerIdentityTypeVisible = true;
        break;
      case 'docType':
        this.selectedDocType = undefined
        this.docTypeForm = new DocType()
        this.isDocTypeVisible = true;
        break;
      case 'country':
        this.selectedCountry = undefined
        this.countryForm = new Country()
        this.isCountryVisible = true;
        break;
      case 'city':
        this.selectedCity = undefined
        this.cityForm = new City()
        this.isCityVisible = true;
        break;
    }
  }

  closeForm(modal: string) {
    switch (modal) {
      case 'customer-add':
        this.citiesByCountry = [];
        this.confirmPassword = ''
        this.phoneForm.get('phone')!.setValue('');
        this.isAddCustomerVisible = false;
        break;
      case 'customer-details': this.isUserDetailsVisible = false; break;
      case 'customer-status': this.isCustomerStatusVisible = false; break;
      case 'customer-identityType': this.isCustomerIdentityTypeVisible = false; break;
      case 'docType': this.isDocTypeVisible = false; break;
      case 'country': this.isCountryVisible = false; break;
      case 'city':
        this.cityList = [];
        this.isCityVisible = false;
        break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isAddCustomerVisible ||
      this.isUserDetailsVisible ||
      this.isCustomerStatusVisible ||
      this.isCustomerIdentityTypeVisible ||
      this.isDocTypeVisible ||
      this.isCountryVisible ||
      this.isCityVisible
    );
  }

  showTab(tabId: string, tabType?: string): void {

    const buttonClass = tabType ? `${tabType}-tab-button` : 'tab-button';
    const contentClass = tabType ? `${tabType}-tab-content` : 'tab-content';
    const tabButtons = document.querySelectorAll(`.${buttonClass}`);
    const tabContents = document.querySelectorAll(`.${contentClass}`);

    // Reset all buttons and contents
    tabButtons.forEach(btn => {
      btn.classList.remove('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
      btn.classList.add('text-gray-500');
    });

    tabContents.forEach(content => content.classList.add('hidden'));

    // Activate the clicked button and show its tab content
    const activeButton = tabType ? document.getElementById(tabType + '-' + tabId) : document.getElementById(tabId);
    activeButton?.classList.add('active', 'text-primary', 'font-medium', 'border-b-2', 'border-primary', 'transition-colors');
    activeButton?.classList.remove('text-gray-500');

    const activeId = tabType ? `${tabType}-tab-${tabId}` : `tab-${tabId}`;
    const activeContent = document.getElementById(activeId);
    activeContent?.classList.remove('hidden');
  }

  fileData: any

  previewDocument(customerDoc: CustomerDoc) {
    this.customerDocService.getFileById(customerDoc.cdoCode!)
  }

  closePreview() {

    this.selectedDoc = undefined
  }

  // Show success message
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    (new Audio('assets/notification.mp3')).play()
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Show error message
  showErrorMessage(message: string): void {
    this.errorMessage = message;
    (new Audio('assets/notification.mp3')).play()
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Clear messages
  clearMessage(): void {
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }
}
