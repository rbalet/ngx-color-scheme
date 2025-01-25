import { InjectionToken } from "@angular/core";
import { ColorSchemeOptions } from "./types";

/**
 * InjectionToken to override default options
 *
 * @example
 *
 * providers: [
 *   {
 *     provide: COLOR_SCHEME_OPTIONS,
 *     useValue: {
 *       colorSchemeClass: 'my-color-scheme',
 *       lightModeClass: 'my-light-mode',
 *     },
 *   },
 * ]
 */
export const COLOR_SCHEME_OPTIONS = new InjectionToken<
  Partial<ColorSchemeOptions>
>("COLOR_SCHEME_OPTIONS");
