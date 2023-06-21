import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { AppModule } from './app/app.module';

registerLocaleData(localeEsMX);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));