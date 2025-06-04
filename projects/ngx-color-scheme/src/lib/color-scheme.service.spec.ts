import { fakeAsync, tick } from '@angular/core/testing'
import { when } from 'jest-when'
import { ColorSchemeOptions } from './color-scheme'
import { ColorSchemeService } from './color-scheme.service'
import { defaultOptions } from './default-options'

describe('ColorSchemeService', () => {
  let element: HTMLElement
  let addClassSpy: jest.SpyInstance
  let removeClassSpy: jest.SpyInstance

  const createService = (options?: Partial<ColorSchemeOptions>): ColorSchemeService => {
    return new ColorSchemeService({ ...options, element } as ColorSchemeOptions)
  }

  const mockLocalStorageColorScheme = (
    colorScheme: 'dark-mode' | 'light-mode',
    storageKey: string = defaultOptions.storageKey,
  ): void => {
    when(localStorage.getItem as jest.Mock)
      .calledWith(storageKey)
      .mockReturnValue(colorScheme)
  }

  beforeAll(() => {
    element = document.body
    addClassSpy = jest.spyOn(element.classList, 'add')
    removeClassSpy = jest.spyOn(element.classList, 'remove')
  })

  beforeEach(() => {
    jest.resetAllMocks()
    element.className = ''
  })

  describe('initialize', () => {
    it('should initialize with light mode by default', () => {
      const colorSchemeService = createService()
      colorSchemeService.init()

      expect(colorSchemeService.$isDarkMode()).toBe(false)
      expect(addClassSpy).toHaveBeenCalledWith(defaultOptions.lightModeClass)
    })

    it('should initialize with dark mode if set in localStorage', () => {
      mockLocalStorageColorScheme('dark-mode')
      const colorSchemeService = createService()
      colorSchemeService.init()

      expect(colorSchemeService.$isDarkMode()).toBe(true)
      expect(addClassSpy).toHaveBeenCalledWith(defaultOptions.darkModeClass)
    })
  })

  it('should prefer localStorage colorScheme value', () => {
    when(localStorage.getItem as jest.Mock)
      .calledWith(defaultOptions.storageKey)
      .mockReturnValueOnce('dark-mode')
      .mockReturnValueOnce('light-mode')

    let colorSchemeService = createService()
    colorSchemeService.init()
    expect(colorSchemeService.$isDarkMode()).toBe(true)
    expect(addClassSpy).toHaveBeenCalledWith(defaultOptions.darkModeClass)

    colorSchemeService = createService()
    colorSchemeService.init()
    expect(colorSchemeService.$isDarkMode()).toBe(false)
    expect(addClassSpy).toHaveBeenCalledWith(defaultOptions.lightModeClass)
  })

  it('should prefer provided options', () => {
    const providedOptions: Partial<ColorSchemeOptions> = {
      darkModeClass: 'provided-color-scheme',
      lightModeClass: 'provided-light-mode',
      storageKey: 'provided-storage-key',
    }

    when(localStorage.getItem as jest.Mock)
      .calledWith(providedOptions.storageKey)
      .mockReturnValueOnce(providedOptions.darkModeClass)

    let colorSchemeService = createService(providedOptions)
    colorSchemeService.init()
    expect(colorSchemeService.$isDarkMode()).toBe(true)
    expect(addClassSpy).toHaveBeenCalledWith(providedOptions.darkModeClass)

    colorSchemeService = createService(providedOptions)
    colorSchemeService.init()
    expect(colorSchemeService.$isDarkMode()).toBe(false)
    expect(addClassSpy).toHaveBeenCalledWith(providedOptions.lightModeClass)
  })

  it('should remove preloadingClass after loading', fakeAsync(() => {
    mockLocalStorageColorScheme('light-mode')
    const colorSchemeService = createService()
    colorSchemeService.init()
    tick()
    expect(removeClassSpy).toHaveBeenCalledWith(defaultOptions.preloadingClass)
  }))

  describe('toggle', () => {
    it('should toggle colorScheme value', () => {
      mockLocalStorageColorScheme('dark-mode')
      const colorSchemeService = createService()
      colorSchemeService.init()
      const colorSchemeValue = colorSchemeService.$isDarkMode.asReadonly()
      expect(colorSchemeValue()).toEqual(true)
      colorSchemeService.toggleColorScheme()
      expect(colorSchemeValue()).toEqual(false)
      colorSchemeService.toggleColorScheme()
      expect(colorSchemeValue()).toEqual(true)
    })
  })

  describe('enable', () => {
    it('should enable dark mode', () => {
      mockLocalStorageColorScheme('light-mode')
      const colorSchemeService = createService()
      colorSchemeService.init()
      const colorSchemeValue = colorSchemeService.$isDarkMode.asReadonly()
      expect(colorSchemeValue()).toEqual(false)
      colorSchemeService.activateDarkMode()
      expect(colorSchemeValue()).toEqual(true)
      expect(addClassSpy).toHaveBeenCalledWith(defaultOptions.darkModeClass)
    })

    it('should not emit when already enabled', () => {
      mockLocalStorageColorScheme('dark-mode')
      const colorSchemeService = createService()
      colorSchemeService.init()
      const colorSchemeValue = colorSchemeService.$isDarkMode.asReadonly()
      expect(colorSchemeValue()).toEqual(true)
      colorSchemeService.activateDarkMode()
      expect(colorSchemeValue()).toEqual(true)
    })
  })

  describe('disable', () => {
    it('should disable dark mode', () => {
      mockLocalStorageColorScheme('dark-mode')
      const colorSchemeService = createService()
      colorSchemeService.init()
      const colorSchemeValue = colorSchemeService.$isDarkMode.asReadonly()
      expect(colorSchemeValue()).toEqual(true)
      colorSchemeService.activateLightMode()
      expect(colorSchemeValue()).toEqual(false)
      expect(addClassSpy).toHaveBeenCalledWith(defaultOptions.lightModeClass)
    })

    it('should not emit when already disabled', () => {
      mockLocalStorageColorScheme('light-mode')
      const colorSchemeService = createService()
      colorSchemeService.init()
      const colorSchemeValue = colorSchemeService.$isDarkMode.asReadonly()
      expect(colorSchemeValue()).toEqual(false)
      colorSchemeService.activateLightMode()
      expect(colorSchemeValue()).toEqual(false)
    })
  })
})
