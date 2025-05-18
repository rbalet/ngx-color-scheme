import { Inject, Injectable, Optional, signal } from '@angular/core'
import { COLOR_SCHEME_OPTIONS } from './color-scheme-options'
import { defaultOptions } from './default-options'
import { ColorSchemeOptions } from './types'

@Injectable()
export class ColorSchemeService {
  private _options!: ColorSchemeOptions
  public $darkMode = signal<boolean>(false)

  constructor(
    @Optional()
    @Inject(COLOR_SCHEME_OPTIONS)
    private providedOptions: ColorSchemeOptions | null,
  ) {}

  init() {
    this._options = { ...defaultOptions, ...(this.providedOptions || {}) }

    const storageColor = localStorage.getItem(this._options.storageKey)
    this.$darkMode = signal<boolean>(
      storageColor
        ? storageColor === this._options.darkModeClass
        : window?.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false,
    )

    this.$darkMode() ? this.activateDarkMode() : this.activateLightMode()

    this.removePreloadingClass()
  }

  matchMedia(query: string): MediaQueryList {
    return window.matchMedia(query)
  }

  toggle(): void {
    this.$darkMode() ? this.activateLightMode() : this.activateDarkMode()
  }

  activateDarkMode(): void {
    this.$darkMode.set(true)

    const { darkModeClass, lightModeClass } = this._options
    const element = this._options.element || document.body

    element.classList.remove(lightModeClass)
    element.classList.add(darkModeClass)

    this.saveColorSchemeToStorage(darkModeClass)
  }

  activateLightMode(): void {
    this.$darkMode.set(false)

    const { darkModeClass, lightModeClass } = this._options
    const element = this._options.element || document.body

    element.classList.remove(darkModeClass)
    element.classList.add(lightModeClass)

    this.saveColorSchemeToStorage(lightModeClass)
  }

  private saveColorSchemeToStorage(colorScheme: string): void {
    localStorage.setItem(this._options.storageKey, colorScheme)
  }

  private removePreloadingClass(): void {
    // defer to next tick
    setTimeout(() => {
      const element = this._options.element || document.body
      element.classList.remove(this._options.preloadingClass)
    })
  }
}
