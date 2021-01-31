import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import {RxjsAppModule} from './rxjs-app/rxjs-app.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(RxjsAppModule)
  .catch(err => console.error(err));
