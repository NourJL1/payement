import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(),
      //csrf
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',   // Must match the cookie Spring sends
        headerName: 'X-XSRF-TOKEN', // Must match Spring’s expected header
      })),
    provideAnimations(),
  ],
};
