// display-settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DisplaySettings {
  theme: string; // 'light', 'dark', 'system'
  language: string;
  dateFormat: string;
  timeFormat: string;
  largerText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DisplaySettingsService {
  private settingsSubject = new BehaviorSubject<DisplaySettings>(this.getDefaultSettings());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    // Load saved settings from localStorage
    this.loadSettings();
  }

  private getDefaultSettings(): DisplaySettings {
    return {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12-hour',
      largerText: false,
      highContrast: false,
      reduceMotion: false
    };
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('displaySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.settingsSubject.next({...this.getDefaultSettings(), ...settings});
        this.applySettings(settings);
      } catch (e) {
        console.error('Error loading display settings', e);
      }
    }
  }

  updateSettings(newSettings: Partial<DisplaySettings>): void {
    const currentSettings = this.settingsSubject.value;
    const updatedSettings = {...currentSettings, ...newSettings};
    
    this.settingsSubject.next(updatedSettings);
    localStorage.setItem('displaySettings', JSON.stringify(updatedSettings));
    this.applySettings(updatedSettings);
  }

  private applySettings(settings: DisplaySettings): void {
    // Apply theme
    this.applyTheme(settings.theme);
    
    // Apply text size
    document.documentElement.classList.toggle('larger-text', settings.largerText);
    
    // Apply high contrast
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    
    // Apply reduced motion
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion);
  }

  private applyTheme(theme: string): void {
    // Remove all theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-system');
    
    // Add the selected theme class
    document.documentElement.classList.add(`theme-${theme}`);
    
    // For system theme, we need to check the system preference
    if (theme === 'system') {
      this.applySystemTheme();
    }
  }

  private applySystemTheme(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('theme-dark', prefersDark);
    document.documentElement.classList.toggle('theme-light', !prefersDark);
  }

  getCurrentSettings(): DisplaySettings {
    return this.settingsSubject.value;
  }
}