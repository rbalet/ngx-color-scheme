import {
  enableProdMode,
  inject,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core'

import { bootstrapApplication } from '@angular/platform-browser'
import { ColorSchemeService } from 'projects/ngx-color-scheme/src/lib/color-scheme.service'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    ColorSchemeService,

    provideAppInitializer(() => {
      const colorSchemeService = inject(ColorSchemeService)

      colorSchemeService.init()
    }),
  ],
}).catch((err) => console.error(err))
