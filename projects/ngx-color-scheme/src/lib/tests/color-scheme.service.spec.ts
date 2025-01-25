import { Renderer2, RendererFactory2 } from "@angular/core";
import { fakeAsync, tick } from "@angular/core/testing";
import { when } from "jest-when";
import { ColorSchemeService } from "../color-scheme.service";
import { defaultOptions } from "../default-options";
import { MediaQueryService } from "../media-query.service";
import { ColorSchemeOptions } from "../types";

describe("ColorSchemeService", () => {
  let rendererMock: Renderer2;
  let rendererFactoryMock: RendererFactory2;
  let mediaQueryServiceMock: MediaQueryService;

  const createService = (
    options?: Partial<ColorSchemeOptions>
  ): ColorSchemeService => {
    return new ColorSchemeService(
      rendererFactoryMock,
      mediaQueryServiceMock,
      options as ColorSchemeOptions
    );
  };

  const mockLocalStorageColorScheme = (
    colorScheme: boolean,
    storageKey: string = defaultOptions.storageKey
  ): void => {
    when(localStorage.getItem as jest.Mock)
      .calledWith(storageKey)
      .mockReturnValue(JSON.stringify({ colorScheme }));
  };

  beforeAll(() => {
    rendererMock = {
      addClass: jest.fn(),
      removeClass: jest.fn(),
    } as unknown as Renderer2;

    rendererFactoryMock = { createRenderer: jest.fn() };

    mediaQueryServiceMock = {
      matchMedia: jest.fn(),
      prefersColorScheme: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();

    when(rendererFactoryMock.createRenderer as jest.Mock)
      .calledWith(null, null)
      .mockReturnValue(rendererMock);
  });

  describe("initialize", () => {
    it("should prefer prefersColorScheme when localStorage is empty", () => {
      (mediaQueryServiceMock.prefersColorScheme as jest.Mock)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      let colorSchemeService = createService();
      expect(colorSchemeService.darkMode$()).toBe(true);
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        defaultOptions.element,
        defaultOptions.darkModeClass
      );

      colorSchemeService = createService();
      expect(colorSchemeService.darkMode$()).toBe(false);
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        defaultOptions.element,
        defaultOptions.lightModeClass
      );
    });

    it("should prefer prefersColorScheme when localStorage contains invalid string value", () => {
      when(localStorage.getItem as jest.Mock)
        .calledWith(defaultOptions.storageKey)
        .mockReturnValue(JSON.stringify({ invalidValue: true }));

      (mediaQueryServiceMock.prefersColorScheme as jest.Mock).mockReturnValue(
        true
      );

      const colorSchemeService = createService();

      expect(colorSchemeService.darkMode$()).toBe(true);
    });

    it("should prefer prefersColorScheme when localStorage contains invalid value", () => {
      global.console.error = jest.fn();

      when(localStorage.getItem as jest.Mock)
        .calledWith(defaultOptions.storageKey)
        .mockReturnValue({ invalidValue: true });

      (mediaQueryServiceMock.prefersColorScheme as jest.Mock).mockReturnValue(
        true
      );

      const colorSchemeService = createService();

      expect(colorSchemeService.darkMode$()).toBe(true);
      expect(global.console.error).toHaveReturnedTimes(1);
    });

    it("should prefer localStorage colorScheme value", () => {
      when(localStorage.getItem as jest.Mock)
        .calledWith(defaultOptions.storageKey)
        .mockReturnValueOnce(JSON.stringify({ colorScheme: true }))
        .mockReturnValueOnce(JSON.stringify({ colorScheme: false }));

      let colorSchemeService = createService();
      expect(colorSchemeService.darkMode$()).toBe(true);
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        defaultOptions.element,
        defaultOptions.darkModeClass
      );

      colorSchemeService = createService();
      expect(colorSchemeService.darkMode$()).toBe(false);
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        defaultOptions.element,
        defaultOptions.lightModeClass
      );
    });

    it("should prefer provided options", () => {
      const providedOptions: Partial<ColorSchemeOptions> = {
        darkModeClass: "provided-color-scheme",
        lightModeClass: "provided-light-mode",
        storageKey: "provided-storage-key",
      };

      when(localStorage.getItem as jest.Mock)
        .calledWith(providedOptions.storageKey)
        .mockReturnValueOnce(JSON.stringify({ colorScheme: true }))
        .mockReturnValueOnce(JSON.stringify({ colorScheme: false }));

      let colorSchemeService = createService(providedOptions);
      expect(colorSchemeService.darkMode$()).toBe(true);
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        defaultOptions.element,
        providedOptions.darkModeClass
      );

      colorSchemeService = createService(providedOptions);
      expect(colorSchemeService.darkMode$()).toBe(false);
      expect(rendererMock.addClass).toHaveBeenCalledWith(
        defaultOptions.element,
        providedOptions.lightModeClass
      );
    });

    it("should remove preloadingClass after loading", fakeAsync(() => {
      createService();

      tick();

      // for enable/disable and remove preloading class
      expect(rendererMock.removeClass).toHaveBeenCalledTimes(2);
      expect(rendererMock.removeClass).toHaveBeenCalledWith(
        defaultOptions.element,
        defaultOptions.preloadingClass
      );
    }));
  });

  describe("toggle", () => {
    it("should toggle colorScheme value", () => {
      // start with true
      mockLocalStorageColorScheme(true);

      const colorSchemeService = createService();
      const colorSchemeValue = colorSchemeService.darkMode$.asReadonly();

      expect(colorSchemeValue()).toEqual(true);

      // true => false
      colorSchemeService.toggle();
      expect(colorSchemeValue()).toEqual(false);

      // false => true
      colorSchemeService.toggle();
      expect(colorSchemeValue()).toEqual(true);
    });
  });

  describe("enable", () => {
    it("should enable dark mode", () => {
      // start with false
      mockLocalStorageColorScheme(false);

      const colorSchemeService = createService();
      const colorSchemeValue = colorSchemeService.darkMode$.asReadonly();

      expect(colorSchemeValue()).toEqual(false);

      colorSchemeService.enable();
      expect(colorSchemeValue()).toEqual(true);
    });

    it("should not emit when already enabled", () => {
      // start with true
      mockLocalStorageColorScheme(true);

      const colorSchemeService = createService();
      const colorSchemeValue = colorSchemeService.darkMode$.asReadonly();

      expect(colorSchemeValue()).toEqual(true);

      colorSchemeService.enable();
      expect(colorSchemeValue()).toEqual(true);
    });
  });

  describe("disable", () => {
    it("should disable dark mode", () => {
      // start with true
      mockLocalStorageColorScheme(true);

      const colorSchemeService = createService();
      const colorSchemeValue = colorSchemeService.darkMode$.asReadonly();

      expect(colorSchemeValue()).toEqual(true);

      colorSchemeService.disable();
      expect(colorSchemeValue()).toEqual(false);
    });

    it("should not emit when already disabled", () => {
      // start with false
      mockLocalStorageColorScheme(false);

      const colorSchemeService = createService();
      const colorSchemeValue = colorSchemeService.darkMode$.asReadonly();

      expect(colorSchemeValue()).toEqual(false);

      colorSchemeService.disable();
      expect(colorSchemeValue()).toEqual(false);
    });
  });
});
