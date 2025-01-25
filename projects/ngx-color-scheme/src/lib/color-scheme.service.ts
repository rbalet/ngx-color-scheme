import {
  Inject,
  Injectable,
  Optional,
  Renderer2,
  RendererFactory2,
  WritableSignal,
  signal,
} from '@angular/core'
import { COLOR_SCHEME_OPTIONS } from './color-scheme-options'
import { defaultOptions } from './default-options'
import { isNil } from './isNil'
import { MediaQueryService } from './media-query.service'
import { ColorSchemeOptions } from './types'

@Injectable({ providedIn: 'root' })
export class ColorSchemeService {
  private readonly options: ColorSchemeOptions
  private readonly renderer: Renderer2
  readonly darkMode$: WritableSignal<boolean>

  constructor(
    private rendererFactory: RendererFactory2,
    private mediaQueryService: MediaQueryService,
    // prettier-ignore
    @Optional() @Inject(COLOR_SCHEME_OPTIONS) private providedOptions: ColorSchemeOptions | null,
  ) {
    this.options = { ...defaultOptions, ...(this.providedOptions || {}) }
    this.renderer = this.rendererFactory.createRenderer(null, null)

    this.darkMode$ = signal<boolean>(this.getInitialColorSchemeValue())
    this.darkMode$() ? this.enable() : this.disable()

    this.removePreloadingClass()
  }

  toggle(): void {
    this.darkMode$() ? this.disable() : this.enable()
  }

  enable(): void {
    const { element, darkModeClass, lightModeClass } = this.options
    this.renderer.removeClass(element, lightModeClass)
    this.renderer.addClass(element, darkModeClass)

    this.saveColorSchemeToStorage(true)
    this.darkMode$.set(true)
  }

  disable(): void {
    const { element, darkModeClass, lightModeClass } = this.options
    this.renderer.removeClass(element, darkModeClass)
    this.renderer.addClass(element, lightModeClass)

    this.saveColorSchemeToStorage(false)
    this.darkMode$.set(false)
  }

  private getInitialColorSchemeValue(): boolean {
    const colorSchemeFromStorage = this.getColorSchemeFromStorage()

    if (isNil(colorSchemeFromStorage)) {
      return this.mediaQueryService.prefersColorScheme()
    }

    return colorSchemeFromStorage
  }

  private saveColorSchemeToStorage(colorScheme: boolean): void {
    localStorage.setItem(this.options.storageKey, JSON.stringify({ colorScheme }))
  }

  private getColorSchemeFromStorage(): boolean | null {
    const storageItem = localStorage.getItem(this.options.storageKey)

    if (storageItem) {
      try {
        return JSON.parse(storageItem)?.colorScheme
      } catch (error) {
        console.error(
          'Invalid colorScheme localStorage item:',
          storageItem,
          'falling back to color scheme media query',
        )
      }
    }

    return null
  }

  private removePreloadingClass(): void {
    // defer to next tick
    setTimeout(() => {
      this.renderer.removeClass(this.options.element, this.options.preloadingClass)
    })
  }
}
