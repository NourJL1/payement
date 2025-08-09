import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { UserProfilesService } from '../../../services/user-profiles.service';
import { UserProfileMenuOptionsService } from '../../../services/user-profile-menu-options.service';
import { ModuleService } from '../../../services/modules.service';
import { MenuOptionService } from '../../../services/menu-option.service';
import { User } from '../../../entities/user';
import { UserProfile } from '../../../entities/user-profile';
import { Module } from '../../../entities/module';
import { MenuOption } from '../../../entities/menu-option';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { UserProfileMenuOption } from '../../../entities/user-profile-menu-option';

@Component({
  selector: 'app-profiling',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule, MatSelectModule],
  templateUrl: './profiling.component.html',
  styleUrl: './profiling.component.css'
})
export class ProfilingComponent {

  constructor(private userService: UserService,
    private authService: AuthService,
    private userProfileService: UserProfilesService,
    private upmoService: UserProfileMenuOptionsService,
    private moduleService: ModuleService,
    private menuOptionService: MenuOptionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef) { }

  allUsers: User[] = []
  filteredUsers: User[] = []
  userSearchTerm?: string
  selectedUser?: User
  userForm: User = new User()

  confirmPassword?: String

  allProfiles: UserProfile[] = []
  filteredProfiles: UserProfile[] = []
  profileSearchTerm?: string
  selectedProfile?: UserProfile
  profileForm: UserProfile = new UserProfile()

  allModules: Module[] = []
  filteredModules: Module[] = []
  moduleSearchTerm?: string
  selectedModule?: Module
  moduleForm: Module = new Module()

  allOptions: MenuOption[] = []
  filteredOptions: MenuOption[] = []
  optionsByModule: MenuOption[] = []
  optionSearchTerm?: string
  selectedOption?: MenuOption
  optionForm: MenuOption = new MenuOption()

  allProfileOptions: UserProfileMenuOption[] = []
  filteredProfileOptions: UserProfileMenuOption[] = []
  profileOptionSearchTerm?: string
  selectedProfileOption?: UserProfileMenuOption
  profileOptionForm: UserProfileMenuOption = new UserProfileMenuOption()

  successMessage: string | null = null;
  errorMessage: string | null = null;

  logos?: string[]

  isUserDetailsVisible = false;
  isUserFormVisible = false;
  isProfileDetailsVisible = false;
  isProfileFormVisible = false;
  isModuleDetailsVisible = false;
  isModuleFormVisible = false;
  isOptionDetailsVisible = false;
  isOptionFormVisible = false;
  isProfileOptionDetailsVisible = false;
  isProfileOptionFormVisible = false

  ngOnInit(): void {
    this.loadAllUsers()
    this.loadAllProfiles()
    this.loadAllModules()
    this.loadAllOptions()
    this.loadAllProfileOptions()
    this.loadIcons()
  }

  loadAllUsers() {
    this.userService.getAll().subscribe({
      next: (users: User[]) => {
        this.allUsers = users
        this.filteredUsers = users
      },
      error: (err) => {
        this.showErrorMessage("failed to load users")
      }
    })
  }

  loadAllProfiles() {
    this.userProfileService.getAllUserProfiles().subscribe({
      next: (profiles: UserProfile[]) => {
        this.allProfiles = profiles
        this.filteredProfiles = profiles
      },
      error: (err) => {
        this.showErrorMessage("failed to load profiles")
      }
    })
  }

  loadAllModules() {
    this.moduleService.getAllModules().subscribe({
      next: (modules: Module[]) => {
        this.allModules = modules
        this.filteredModules = modules
      },
      error: (err) => {
        this.showErrorMessage("failed to load modules")
      }
    })
  }

  loadAllOptions() {
    this.menuOptionService.getAllMenuOptions().subscribe({
      next: (options: MenuOption[]) => {
        this.allOptions = options
        this.filteredOptions = options
      },
      error: (err) => {
        this.showErrorMessage("failed to load options")
      }
    })
  }

  loadAllProfileOptions() {
    this.upmoService.getAllProfileMenuOptions().subscribe({
      next: (upmo: UserProfileMenuOption[]) => {
        this.allProfileOptions = upmo
        this.filteredProfileOptions = upmo
      },
      error: (err) => {
        this.showErrorMessage("failed to load profile options")
      }
    })
  }

  loadIcons() {
    this.http.get<string[]>('assets/icons.json').subscribe({
      next: (icons: string[]) => {
        this.logos = icons;
      },
      error: (error) => {
        this.showErrorMessage(error)
      }
    })
  }

  // user methods

  editUser(user: User) {
    this.selectedUser = user
    this.userForm = { ...user, fullName: user.fullName }

    const phone = user.phone!
    this.phoneForm.get('phone')!.setValue(phone);

    this.isUserFormVisible = true;
    this.cdr.detectChanges();
  }

  addUser() {
    const emailRef = document.getElementById("emailRef") as HTMLDivElement
    const phoneRef = document.getElementById("phoneRef") as HTMLDivElement
    const usernameRef = document.getElementById("usernameRef") as HTMLDivElement
    if (usernameRef.innerHTML || phoneRef.innerHTML || emailRef.innerHTML) {
      this.showErrorMessage("Some fields are already in use!")
      return
    }
    if (this.userForm.password != this.confirmPassword) {
      this.showErrorMessage("Passwords mismatch!")
      return
    }

    const confirmRef = document.getElementById("confirm") as HTMLDivElement

    this.userService.create(this.userForm).subscribe({
      next: (user: User) => {
        this.allUsers.push(user);
        this.confirmPassword = ''
        this.isUserFormVisible = false;
        this.showSuccessMessage('User added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('add User: Error:', err);
        this.showErrorMessage('Failed to add user: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateUser() {
    const emailRef = document.getElementById("emailRef") as HTMLDivElement
    const phoneRef = document.getElementById("phoneRef") as HTMLDivElement
    //const usernameRef = document.getElementById("usernameRef") as HTMLDivElement
    if (/* usernameRef.innerHTML ||  */phoneRef.innerHTML || emailRef.innerHTML) {
      this.showErrorMessage("Some fields are already in use!")
      return
    }

    this.userService.update(this.userForm.code!, this.userForm).subscribe({
      next: (user: User) => {
        const index = this.allUsers.findIndex(u => u.code === this.userForm.code);
        if (index !== -1) {
          this.allUsers[index] = user;
        }
        this.userForm = new User();
        this.selectedUser = undefined;
        this.confirmPassword = ''
        this.isUserFormVisible = false;
        this.showSuccessMessage('User updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.log('update user: Error:', err);
        this.showErrorMessage('Failed to update user: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteUser(user: User) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(user.code!).subscribe({
        next: () => {
          this.allUsers = this.allUsers.filter(u => u.code !== user?.code);
          this.filteredUsers = this.filteredUsers.filter(u => u.code !== user?.code);
          this.showSuccessMessage('Customer deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err) }
      })
    }
  }

  usernameExists() {
    if (!this.userForm.login)
      return
    return this.authService.existsByUsername(this.userForm.login).subscribe({
      next: (response) => {
        const fieldRef = document.getElementById("usernameRef") as HTMLDivElement
        fieldRef.innerHTML = response ? 'Username already in use' : '';
      },
      error: (err) => { console.log(err.message) }
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

    const phoneValue = phoneControl.value;
    this.userForm.phone = phoneValue.e164Number as string;

    if (!this.userForm.phone || this.userForm.phone == this.selectedUser?.phone)
      return
    return this.authService.existsByPhone(this.userForm.phone).subscribe({
      next: (response) => {
        fieldRef.innerHTML = (this.selectedUser?.phone != this.userForm.phone && response) ? 'Phone number already in use' : '';
      },
      error: (err) => { console.log(err.message) }
    });
  }

  emailExists() {
    if (!this.userForm.email)
      return
    return this.authService.existsByEmail(this.userForm.email).subscribe({
      next: (response) => {
        const fieldRef = document.getElementById("emailRef") as HTMLDivElement
        fieldRef.innerHTML = (this.selectedUser?.email != this.userForm.email && response) ? 'Email already in use' : '';
      },
      error: (err) => { console.log(err.message) }
    });
  }

  filterUsers() {
    if (!this.selectedProfile && !this.userSearchTerm)
      this.loadAllUsers()
    else {
      this.filteredUsers = this.allUsers.filter(user => {
        return (!this.selectedProfile || user.profile?.code === this.selectedProfile?.code)
      })
    }
    if (this.userSearchTerm) {
      this.userService.search(this.userSearchTerm).subscribe({
        next: (searchResults: User[]) => {
          this.filteredUsers = searchResults.filter(searchedUser =>
            this.filteredUsers.some(localUser => localUser.code === searchedUser.code)
          );
          //this.filteredWallets = this.filteredWallets.filter(wallet => {return searchResults.some(sr => sr.walCode === wallet.walCode)});
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to search users: ${error.status} ${error.statusText}` : 'Failed to search users: Server error';
          this.showErrorMessage(message);
          console.log('Error searching useers:', error);
        }
      })
    }
  }

  // Phone Form Control
  phoneForm = new FormGroup({
    phone: new FormControl()//<PhoneNumber | null>(null)
  });

  // profile methods

  editProfile(profile: UserProfile) {
    this.selectedProfile = profile
    this.profileForm = { ...profile }
    this.isProfileFormVisible = true
    this.cdr.detectChanges();
  }

  addProfile() {
    this.userProfileService.createUserProfile(this.profileForm).subscribe({
      next: (profile: UserProfile) => {
        this.allProfiles.push(profile);
        this.profileForm = new UserProfile();
        this.isProfileFormVisible = false;
        this.showSuccessMessage('User added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('add profile: Error:', err);
        this.showErrorMessage('Failed to add profile: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateProfile() {
    this.userProfileService.updateUserProfile(this.profileForm.code!, this.profileForm).subscribe({
      next: (profile: UserProfile) => {
        const index = this.allProfiles.findIndex(up => up.code === this.profileForm.code);
        if (index !== -1) {
          this.allProfiles[index] = profile;
          //this.statuses = [...this.statuses];
        }
        this.profileForm = new UserProfile();
        this.selectedProfile = undefined;
        this.isProfileFormVisible = false;
        this.showSuccessMessage('profile updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.log('update profile: Error:', err);
        this.showErrorMessage('Failed to update profile: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteProfile(profile: UserProfile) {
    if (confirm('Are you sure you want to delete this profile?')) {
      this.userProfileService.deleteUserProfile(profile.code!).subscribe({
        next: () => {
          this.allProfiles = this.allProfiles.filter(up => up.code !== profile?.code);
          this.filteredProfiles = this.filteredProfiles.filter(up => up.code !== profile?.code);
          this.showSuccessMessage('Profile deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err); this.showErrorMessage(err) }
      })
    }
  }

  toggleModule(module: Module) {
    const exists = this.profileForm.modules!.some(m => m.code === module.code);
    exists
      ? this.profileForm.modules = this.profileForm.modules?.filter(m => m.code !== module.code)
      : this.profileForm.modules?.push(module);
  }

  isModuleSelected(module: Module){
    return this.profileForm.modules?.some(m => m.code === module.code)
  }

  profileSearch() {
    if (!this.profileSearchTerm)
      this.loadAllProfiles()
    else {
      this.userProfileService.search(this.profileSearchTerm).subscribe({
        next: (searchResults: UserProfile[]) => {
          this.filteredProfiles = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search profiles: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  // module methods

  editModule(module: Module) {
    this.selectedModule = module
    this.moduleForm = { ...module }
    this.isModuleFormVisible = true
    this.cdr.detectChanges();
  }

  addModule() {
    if (!this.moduleForm.logo) {
      this.showErrorMessage("form not valid: Logo missing")
      return;
    }
    this.moduleService.createModule(this.moduleForm).subscribe({
      next: (module: Module) => {
        this.allModules.push(module);
        this.moduleForm = new Module();
        this.isModuleFormVisible = false;
        this.showSuccessMessage('Module added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('add module: Error:', err);
        this.showErrorMessage('Failed to add module: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateModule() {
    this.moduleService.updateModule(this.moduleForm.code!, this.moduleForm).subscribe({
      next: (module: Module) => {
        const index = this.allModules.findIndex(mod => mod.code === this.moduleForm.code);
        if (index !== -1) {
          this.allModules[index] = module;
          //this.statuses = [...this.statuses];
        }
        this.moduleForm = new Module();
        this.selectedModule = undefined;
        this.isModuleFormVisible = false;
        this.showSuccessMessage('module updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.log('update module: Error:', err);
        this.showErrorMessage('Failed to update module: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteModule(module: Module) {
    if (confirm('Are you sure you want to delete this module?')) {
      this.moduleService.deleteModule(module.code!).subscribe({
        next: () => {
          this.allModules = this.allModules.filter(mod => mod.code !== module?.code);
          this.filteredModules = this.filteredModules.filter(mod => mod.code !== module?.code);
          this.showSuccessMessage('Module deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err); this.showErrorMessage(err) }
      })
    }
  }

  moduleSearch() {
    if (!this.moduleSearchTerm)
      this.loadAllModules()
    else {
      this.moduleService.search(this.moduleSearchTerm).subscribe({
        next: (searchResults: Module[]) => {
          this.filteredModules = searchResults;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorMessage(`Failed to search modules: ${error.status} ${error.statusText}`);
        }
      })
    }
  }

  // option methods

  editOption(option: MenuOption) {
    this.selectedOption = option
    this.optionForm = { ...option }
    this.isOptionFormVisible = true
    this.cdr.detectChanges();
  }

  addOption() {
    if (!this.optionForm.module) {
      this.showErrorMessage("form not valid: Module missing")
      return;
    }
    this.menuOptionService.createMenuOption(this.optionForm).subscribe({
      next: (option: MenuOption) => {
        this.allOptions.push(option);
        this.optionForm = new MenuOption();
        this.isOptionFormVisible = false;
        this.showSuccessMessage('Option added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('add option: Error:', err);
        this.showErrorMessage('Failed to add option: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateOption() {
    if (!this.optionForm.module) {
      this.showErrorMessage("form not valid: Module missing")
      return;
    }
    this.menuOptionService.updateMenuOption(this.optionForm.code!, this.optionForm).subscribe({
      next: (option: MenuOption) => {
        const index = this.allOptions.findIndex(mop => mop.code === this.optionForm.code);
        if (index !== -1) {
          this.allOptions[index] = option;
          //this.statuses = [...this.statuses];
        }
        this.optionForm = new MenuOption();
        this.selectedOption = undefined;
        this.isOptionFormVisible = false;
        this.showSuccessMessage('Option updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.log('update option: Error:', err);
        this.showErrorMessage('Failed to update option: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteOption(option: MenuOption) {
    if (confirm('Are you sure you want to delete this option?')) {
      this.menuOptionService.deleteMenuOption(option.code!).subscribe({
        next: () => {
          this.allOptions = this.allOptions.filter(mop => mop.code !== option?.code);
          this.filteredOptions = this.filteredOptions.filter(mop => mop.code !== option?.code);
          this.showSuccessMessage('Option deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err); this.showErrorMessage(err) }
      })
    }
  }

  filterOptions() {
    if (!this.selectedModule && !this.optionSearchTerm)
      this.loadAllOptions()
    else {
      this.filteredOptions = this.allOptions.filter(option => {
        return (!this.selectedModule || option.module?.code === this.selectedModule?.code)
      })
    }
    if (this.optionSearchTerm) {
      this.menuOptionService.search(this.optionSearchTerm).subscribe({
        next: (searchResults: MenuOption[]) => {
          this.filteredOptions = searchResults.filter(searchedOption =>
            this.filteredOptions.some(localOption => localOption.code === searchedOption.code)
          );
          //this.filteredWallets = this.filteredWallets.filter(wallet => {return searchResults.some(sr => sr.walCode === wallet.walCode)});
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to search options: ${error.status} ${error.statusText}` : 'Failed to search options: Server error';
          this.showErrorMessage(message);
          console.log('Error searching options:', error);
        }
      })
    }
  }

  // profile option methods

  editProfileOption(upmo: UserProfileMenuOption) {
    this.selectedProfileOption = upmo
    this.profileOptionForm = { ...upmo }
    this.isProfileOptionFormVisible = true
    this.cdr.detectChanges();
  }

  addProfileOption() {
    if (!this.profileOptionForm.profile || !this.selectedModule || !this.profileOptionForm.menuOption) {
      this.showErrorMessage("form not valid")
      return;
    }
    this.upmoService.createProfileMenuOption(this.profileOptionForm).subscribe({
      next: (upmo: UserProfileMenuOption) => {
        this.allProfileOptions.push(upmo);
        this.profileOptionForm = new UserProfileMenuOption();
        this.isProfileOptionFormVisible = false;
        this.showSuccessMessage('Profile option added successfully');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('add profile option: Error:', err);
        this.showErrorMessage('Failed to add profile option: ' + (err.error?.message || 'Please check the form.'));
      }
    })
  }

  updateProfileOption() {
    if (!this.profileOptionForm.profile || !this.selectedModule || !this.profileOptionForm.menuOption) {
      this.showErrorMessage("form not valid")
      return;
    }
    this.upmoService.updateProfileMenuOption(this.profileOptionForm.id!, this.profileOptionForm).subscribe({
      next: (upmo: UserProfileMenuOption) => {
        const index = this.allProfileOptions.findIndex(po => po.id === this.profileOptionForm.id);
        if (index !== -1) {
          this.allProfileOptions[index] = upmo;
          //this.statuses = [...this.statuses];
        }
        this.profileOptionForm = new UserProfileMenuOption();
        this.selectedProfileOption = undefined;
        this.isProfileOptionFormVisible = false;
        this.showSuccessMessage('Profile option updated successfully');
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.log('update option: Error:', err);
        this.showErrorMessage('Failed to update profile option: ' + (err.error?.message || 'Please try again.'));
      }
    })
  }

  deleteProfileOption(upmo: UserProfileMenuOption) {
    if (confirm('Are you sure you want to delete this profile option?')) {
      this.upmoService.deleteProfileMenuOption(upmo.id!).subscribe({
        next: () => {
          this.allProfileOptions = this.allProfileOptions.filter(po => po.id !== upmo?.id);
          this.filteredProfileOptions = this.filteredProfileOptions.filter(po => po.id !== upmo?.id);
          this.showSuccessMessage('Profile option deleted successfully');
          this.cdr.detectChanges();
        },
        error: (err) => { console.log(err); this.showErrorMessage(err) }
      })
    }
  }

  getUnassignedOptions(): MenuOption[] {
    if (!this.profileOptionForm.profile || !this.selectedModule) {
      return this.optionsByModule;
    }

    const assignedOptionIds = this.profileOptionForm.profile.profileMenuOptions
      ?.map(pmo => pmo.menuOption?.code) || [];

    // Return options not in the assigned list
    return this.optionsByModule.filter(option =>
      !assignedOptionIds.includes(option.code)
    );
  }

  filterProfileOptions() {
    if (!this.selectedProfile && !this.selectedModule && !this.selectedOption && !this.profileOptionSearchTerm)
      this.loadAllProfileOptions()
    else {
      this.filteredProfileOptions = this.allProfileOptions.filter(profileOption => {
        return (!this.selectedProfile || profileOption.profile?.code === this.selectedProfile?.code) &&
          (!this.selectedModule || profileOption.menuOption?.module?.code === this.selectedModule?.code) &&
          (!this.selectedOption || profileOption.menuOption?.code === this.selectedOption?.code)
      })
    }/* 
    if (this.profileOptionSearchTerm) {
      this.upmoService.search(this.profileOptionSearchTerm).subscribe({
        next: (searchResults: UserProfileMenuOption[]) => {
          this.filteredProfileOptions = searchResults.filter(searchedUpmo =>
            this.filteredProfileOptions.some(localUpmo => localUpmo.id === searchedUpmo.id)
          );
          //this.filteredWallets = this.filteredWallets.filter(wallet => {return searchResults.some(sr => sr.walCode === wallet.walCode)});
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          const message = error.status ? `Failed to search profile option: ${error.status} ${error.statusText}` : 'Failed to search profile option: Server error';
          this.showErrorMessage(message);
          console.log('Error searching profile options:', error);
        }
      })
    } */
  }

  onModuleChange(module: Module): void {
    if (!module) {
      this.selectedOption = undefined
      this.optionsByModule = [];
      return;
    }
    this.menuOptionService.getMenuOptionsByModule(module!.code!).subscribe(
      {
        next: (options: MenuOption[]) => {
          this.optionsByModule = options;
        },
        error: (err) => {
          console.log(err); this.showErrorMessage(err)
        }
      }
    );
  }

  // template
  compareBy(prop: keyof any) {
    return (a: any, b: any) => a?.[prop] === b?.[prop];
  }

  toggleForm(modal: string) {
    switch (modal) {
      case 'user-form':
        this.selectedUser = undefined
        this.userForm = new User()
        this.isUserFormVisible = true;
        break;
      case 'user-details': this.isUserDetailsVisible = true; break;

      case 'profile-form':
        this.selectedProfile = undefined
        this.profileForm = new UserProfile()
        this.isProfileFormVisible = true;
        break;
      case 'profile-details':
        /* this.userProfileService.getProfileModules(this.selectedProfile!.code!).subscribe({
          next: (modules: Module[]) => {
            this.selectedProfile?.modules = modules
          },
          error: (err) => {
            console.log(err)
          }
        }) */
        this.isProfileDetailsVisible = true;
        break;

      case 'module-form':
        this.selectedModule = undefined
        this.moduleForm = new Module()
        this.isModuleFormVisible = true;
        break;
      case 'module-details': this.isModuleDetailsVisible = true; break;

      case 'option-form':
        this.selectedOption = undefined
        this.optionForm = new MenuOption()
        this.isOptionFormVisible = true;
        break;
      case 'option-details': this.isOptionDetailsVisible = true; break;

      case 'profile-option-form':
        this.selectedProfileOption = undefined
        this.profileOptionForm = new UserProfileMenuOption()
        this.isProfileOptionFormVisible = true;
        break;
      case 'profile-option-details': this.isProfileOptionDetailsVisible = true; break;
    }
  }

  closeForm(modal: string) {
    switch (modal) {
      case 'user-form': this.isUserFormVisible = false; break;
      case 'user-details': this.isUserDetailsVisible = false; break;

      case 'profile-form': this.isProfileFormVisible = false; break;
      case 'profile-details': this.isProfileDetailsVisible = false; break;

      case 'module-form': this.isModuleFormVisible = false; break;
      case 'module-details': this.isModuleDetailsVisible = false; break;

      case 'option-form': this.isOptionFormVisible = false; break;
      case 'option-details': this.isOptionDetailsVisible = false; break;

      case 'profile-option-form': this.isProfileOptionFormVisible = false; break;
      case 'profile-option-details': this.isProfileOptionDetailsVisible = false; break;
    }
  }

  get isAnyModalVisible(): boolean {
    return (
      this.isUserDetailsVisible ||
      this.isUserFormVisible ||
      this.isProfileDetailsVisible ||
      this.isProfileFormVisible ||
      this.isModuleDetailsVisible ||
      this.isModuleFormVisible ||
      this.isOptionDetailsVisible ||
      this.isOptionFormVisible ||
      this.isProfileOptionFormVisible ||
      this.isProfileOptionDetailsVisible
    );
  }


  // Show specific tab
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

  // Show success message
  showSuccessMessage(message: string): void {
    (new Audio('assets/notification.mp3')).play()
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Show error message
  showErrorMessage(message: string): void {
    (new Audio('assets/notification.mp3')).play()
    this.errorMessage = message;
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
