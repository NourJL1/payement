import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profiling',
  imports: [CommonModule, FormsModule],
  templateUrl: './profiling.component.html',
  styleUrl: './profiling.component.css'
})
export class ProfilingComponent {

  constructor(private cdr: ChangeDetectorRef) {}

  successMessage: string | null = null;
  errorMessage: string | null = null;

  isUserDetailsVisible = false;
  isUserFormVisible = false;
  isProfileDetailsVisible = false;
  isProfileFormVisible = false;
  isModuleDetailsVisible = false;
  isModuleFormVisible = false;
  isOptionDetailsVisible = false;
  isOptionFormVisible = false;

    toggleForm(modal: string) {
      switch (modal) {
        case 'user-form': this.isUserFormVisible = true; break;
        case 'user-details': this.isUserDetailsVisible = true; break;
        case 'profile-form': this.isProfileFormVisible = true; break;
        case 'profile-details': this.isProfileDetailsVisible = true; break;
        case 'module-form': this.isModuleFormVisible = true; break;
        case 'module-details': this.isModuleDetailsVisible = true; break;
        case 'option-form': this.isOptionFormVisible = true; break;
        case 'option-details': this.isOptionDetailsVisible = true; break;
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
        this.isOptionFormVisible
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
    console.log('showSuccessMessage:', message);
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Show error message
  showErrorMessage(message: string): void {
    console.log('showErrorMessage:', message);
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  // Clear messages
  clearMessage(): void {
    console.log('clearMessage: Clearing messages');
    this.successMessage = null;
    this.errorMessage = null;
    this.cdr.detectChanges();
  }

}
