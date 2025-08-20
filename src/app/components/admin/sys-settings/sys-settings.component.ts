import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ModuleService } from '../../../services/modules.service';
import { Module } from '../../../entities/module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sys-settings',
  imports: [CommonModule],
  templateUrl: './sys-settings.component.html',
  styleUrl: './sys-settings.component.css'
})
export class SysSettingsComponent {

  constructor(
    private moduleService: ModuleService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef) { }

  successMessage: string | null = null;
  errorMessage: string | null = null;

  modules?: Module[]

    ngOnInit(): void {
      this.loadAllModules()
    }
  
    loadAllModules() {
      this.moduleService.getAll().subscribe({
        next: (modules: Module[]) => {
          this.modules = modules
        },
        error: (err) => {
          this.showErrorMessage("failed to load modules")
        }
      })
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
