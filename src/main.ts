import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

function createScriptRecaptcha() {
  const scriptEl = window.document.createElement('script');
  scriptEl.src = `https://www.google.com/recaptcha/api.js?render=${environment.receptcha.sitekey}`;
  window.document.body.appendChild(scriptEl);
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

createScriptRecaptcha();