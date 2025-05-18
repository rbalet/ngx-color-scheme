import { enableProdMode, inject, provideAppInitializer } from '@angular/core'

import { bootstrapApplication } from '@angular/platform-browser'
import { ColorSchemeService } from 'projects/ngx-color-scheme/src/lib/color-scheme.service'
import { AppComponent } from './app/app.component'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    ColorSchemeService,

    provideAppInitializer(() => {
      const colorSchemeService = inject(ColorSchemeService)

      colorSchemeService.init()
    }),
  ],
}).catch((err) => console.error(err))
