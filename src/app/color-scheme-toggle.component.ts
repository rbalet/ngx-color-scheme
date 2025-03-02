import { Component } from '@angular/core'
import { ColorSchemeService } from 'projects/ngx-color-scheme/src/lib/color-scheme.service'

@Component({
  selector: 'app-color-scheme-toggle',
  template: `
    <input
      id="colorScheme"
      type="checkbox"
      [checked]="darkMode$()"
      (change)="onToggle()"
      class="toggle"
    />
    <label class="toggle-label" for="colorScheme">
      <img src="assets/moon.svg" class="moon" />
      <img src="assets/sun.svg" class="sun" />
    </label>
  `,
  styles: [
    `
      .toggle {
        display: none;
      }

      .toggle-label {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 3rem;
        overflow: hidden;
      }

      .sun,
      .moon {
        position: absolute;
        left: 0;
        width: 100%;
        height: auto;
        transition: top 0.3s;
      }

      .sun {
        top: 0;
      }

      .moon {
        top: -150%;
      }

      .toggle:checked + .toggle-label .sun {
        top: 150%;
      }

      .toggle:checked + .toggle-label .moon {
        top: 0;
      }
    `,
  ],
})
export class ColorSchemeToggleComponent {
  readonly darkMode$ = this.colorSchemeService.darkMode$

  constructor(private colorSchemeService: ColorSchemeService) {}

  onToggle(): void {
    this.colorSchemeService.toggle()
  }
}
