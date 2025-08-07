import { Inject, Injectable, Optional, signal } from '@angular/core'
import { COLOR_SCHEME_OPTIONS, ColorSchemeOptions } from './color-scheme-options'
import { defaultOptions } from './default-options'

@Injectable()
export class ColorSchemeService {
  public $isDarkMode = signal<boolean>(false)

  private _options!: ColorSchemeOptions

  constructor(
    @Optional()
    @Inject(COLOR_SCHEME_OPTIONS)
    private providedOptions: ColorSchemeOptions | null,
  ) {}

  init() {
    this._options = { ...defaultOptions, ...(this.providedOptions || {}) }

    const storageColor = localStorage.getItem(this._options.storageKey)
    const isDarkMode = storageColor
      ? storageColor === this._options.darkModeClass
      : window?.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false

    isDarkMode ? this.activateDarkMode() : this.activateLightMode()

    this.removePreloadingClass()
  }

  toggleColorScheme() {
    this.$isDarkMode() ? this.activateLightMode() : this.activateDarkMode()
  }

  activateDarkMode() {
    this.$isDarkMode.set(true)

    const { darkModeClass, lightModeClass } = this._options
    const element = this._options.element || document.body

    element.classList.remove(lightModeClass)
    element.classList.add(darkModeClass)

    localStorage.setItem(this._options.storageKey, darkModeClass)

    this.afterChange(true)
  }

  activateLightMode() {
    this.$isDarkMode.set(false)

    const { darkModeClass, lightModeClass } = this._options
    const element = this._options.element || document.body

    element.classList.remove(darkModeClass)
    element.classList.add(lightModeClass)

    localStorage.setItem(this._options.storageKey, lightModeClass)

    this.afterChange(false)
  }

  afterChange(isDarkMode: boolean) {
    // Meant to be overridden
  }

  private removePreloadingClass(): void {
    // defer to next tick
    setTimeout(() => {
      const element = this._options.element || document.body
      element.classList.remove(this._options.preloadingClass)
    })
  }
}
