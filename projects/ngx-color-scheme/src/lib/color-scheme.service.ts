import { Inject, Injectable, Optional, signal } from '@angular/core'
import { ColorSchemeOptions } from './color-scheme'
import { COLOR_SCHEME_OPTIONS } from './color-scheme-options'
import { defaultOptions } from './default-options'

@Injectable()
export class ColorSchemeService {
  private _options!: ColorSchemeOptions
  public $isDarkMode = signal<boolean>(false)

  constructor(
    @Optional()
    @Inject(COLOR_SCHEME_OPTIONS)
    private providedOptions: ColorSchemeOptions | null,
  ) {}

  init() {
    this._options = { ...defaultOptions, ...(this.providedOptions || {}) }

    const storageColor = localStorage.getItem(this._options.storageKey)
    this.$isDarkMode = signal<boolean>(
      storageColor
        ? storageColor === this._options.darkModeClass
        : window?.matchMedia
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
          : false,
    )

    this.$isDarkMode() ? this.activateDarkMode() : this.activateLightMode()

    this.removePreloadingClass()
  }

  matchMedia(query: string): MediaQueryList {
    return window.matchMedia(query)
  }

  toggle(): void {
    this.$isDarkMode() ? this.activateLightMode() : this.activateDarkMode()
  }

  activateDarkMode(): void {
    this.$isDarkMode.set(true)

    const { darkModeClass, lightModeClass } = this._options
    const element = this._options.element || document.body

    element.classList.remove(lightModeClass)
    element.classList.add(darkModeClass)

    localStorage.setItem(this._options.storageKey, darkModeClass)
  }

  activateLightMode(): void {
    this.$isDarkMode.set(false)

    const { darkModeClass, lightModeClass } = this._options
    const element = this._options.element || document.body

    element.classList.remove(darkModeClass)
    element.classList.add(lightModeClass)

    localStorage.setItem(this._options.storageKey, lightModeClass)
  }

  private removePreloadingClass(): void {
    // defer to next tick
    setTimeout(() => {
      const element = this._options.element || document.body
      element.classList.remove(this._options.preloadingClass)
    })
  }
}
