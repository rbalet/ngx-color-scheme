<p align="center">
    <img width="600px" src="https://raw.githubusercontent.com/talohana/angular-dark-mode/master/logo.svg" />
</p>

<hr />

![GitHub](https://img.shields.io/github/license/rbalet/ngx-color-scheme)
![Codecov](https://img.shields.io/codecov/c/github/rbalet/ngx-color-scheme)
![Travis (.com)](https://img.shields.io/travis/com/rbalet/ngx-color-scheme)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
![npm bundle size](https://img.shields.io/bundlephobia/min/ngx-color-scheme)
![npm](https://img.shields.io/npm/v/ngx-color-scheme)
![npm](https://img.shields.io/npm/dw/ngx-color-scheme)

ngx-color-scheme is a zero-dependency library that helps you integrate dark mode into you Angular applications with ease!

[👉🏻 Live Demo 👈🏻](https://stackblitz.com/edit/ngx-color-scheme-v3-example?file=src/app.component.ts)

Inspired by the awesome [use-dark-mode](https://github.com/donavon/use-dark-mode) library

Forked from the not more maintained [angular-dark-mode](https://github.com/talohana/angular-dark-mode) library

<p align="center">
  <img width="400px" src="https://raw.githubusercontent.com/talohana/angular-dark-mode/master/example.gif" />
</p>

## Installation

To use ngx-color-scheme in your project install it via npm:

```
// npm npm i ngx-color-scheme
```

and provide it inside your `min.ts` file:

```typescript
import { ColorSchemeService } from 'ngx-color-scheme'

bootstrapApplication(AppComponent, {
  providers: [
    ColorSchemeService,

    provideAppInitializer(() => {
      const colorSchemeService = inject(ColorSchemeService)

      colorSchemeService.init()
    }),
  ],
}).catch((err) => console.error(err))
```


or inside the `app.module.ts` file 

```typescript
import { ColorSchemeService } from 'ngx-color-scheme'

export function initColorScheme(colorSchemeService: ColorSchemeService) {
  return () => colorSchemeService
}

@NgModule({
// ...
providers: [
    {
      provide: APP_INITIALIZER, // If you wish to instantiate it before the App renders
      useFactory: initColorScheme,
      deps: [ColorSchemeService],
      multi: true,
    },
]
})
```

## SSR
In case you'd like to use it with Angular SSR.
As the library is using `document.body`, you need to instantiate it inside the `app.component.ts` file. 

_Note: The app will have initially no state when it first load, but this cannot be avoided._

```typescript
// app.component.ts
import { afterRender } from '@angular/core'
import { ColorSchemeService } from 'ngx-color-scheme'

export class AppComponent {
  constructor(
    private _colorSchemeService: ColorSchemeService,
  ) {
    const singleRender = afterRender(() => {
      this._colorSchemeService.init()
      singleRender.destroy()
    })
  }
}
```


## Usage

In order to use ngx-color-scheme you need to inject the service somewhere in your applications - presumably where you hold the dark mode toggle, and get the dark mode value from the exported `colorScheme$` Observable:

```ts
// color-scheme-toggle.component.ts

@Component({
  selector: 'app-color-scheme-toggle',
  template: `<input
    type="checkbox"
    [checked]="$isDarkMode"
    (change)="onToggle()"
  />`,
})
export class ColorSchemeToggle {
  readonly #colorSchemeService = inject(ColorSchemeService);

  $isDarkMode = this.#colorSchemeService.$isDarkMode.asReadonly();

  onToggle(): void {
    this.#colorSchemeService.toggle();
  }
}
```

Next, include global styles and some text to reflect the mode:

```css
/* styles.css */

body.dark-mode {
  background-color: #2d3436;
  color: #dfe6e9;
}

body.light-mode {
  background-color: #dfe6e9;
  color: #2d3436;
}
```

You're all set!  
Save and run your application, play with the toggle button to change between modes.

## Options

`ngx-color-scheme` ships with the following options:

| Option           |                         Description                          |               Default Value |
| ---------------- | :----------------------------------------------------------: | --------------------------: |
| colorSchemeClass |                   dark mode css class name                   |               `'dark-mode'` |
| lightModeClass   |                  light mode css class name                   |              `'light-mode'` |
| preloadingClass  | css class name to flag that `element` is in preloading state | `'color-scheme-preloading'` |
| storageKey       |            localStorage key to persist dark mode             |               `'dark-mode'` |
| element          |         target HTMLElement to set given css classes          |             `document.body` |

<br />

All options are set to default and can be configured via the `COLOR_SCHEME_OPTIONS` InjectionToken:

```ts
import { COLOR_SCHEME_OPTIONS } from 'ngx-color-scheme';

@NgModule({
    ...
    providers: [
        {
            provide: COLOR_SCHEME_OPTIONS,
            useValue: {
                colorSchemeClass: 'my-dark-mode',
                lightModeClass: 'my-light-mode'
            }
        }
    ]
    ...
})
export class AppModule {}
```

### Transitioning

It is often useful to transition the changes between dark and light modes, and most of the time we would want to skip the initial transition, in order to achieve this use the `preloadingClass` option like so:

```css
/* styles.css */
...

body:not(.color-scheme-preloading) {
  transition: all 0.3s linear;
}

...
```

## Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://talohana.com/"><img src="https://avatars.githubusercontent.com/u/24203431?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tal Ohana</b></sub></a><br /><a href="https://github.com/TalOhana/ngx-color-scheme/commits?author=talohana" title="Code">💻</a> <a href="https://github.com/TalOhana/ngx-color-scheme/commits?author=talohana" title="Documentation">📖</a> <a href="#maintenance-talohana" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/Guysh9"><img src="https://avatars.githubusercontent.com/u/75510227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guy Shemesh</b></sub></a><br /><a href="#design-Guysh9" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/rbalet"><img src="https://avatars.githubusercontent.com/u/44493964?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Raphaël Balet
</b></sub></a><br /><a href="https://github.com/TalOhana/ngx-color-scheme/commits?author=rbalet" title="Code">💻</a> <a href="https://github.com/TalOhana/ngx-color-scheme/commits?author=rbalet" title="Documentation">📖</a> <a href="#maintenance-rbalet" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
