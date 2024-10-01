// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(FormsModule) // Thêm FormsModule vào đây
  ],
}).catch((err) => console.error(err));
