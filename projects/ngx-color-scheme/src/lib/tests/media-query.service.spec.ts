import { when } from "jest-when";
import { prefersDarkSchemeQuery } from "../media-query";
import { MediaQueryService } from "../media-query.service";

describe("MediaQueryService", () => {
  let mediaQueryService: MediaQueryService;

  beforeEach(() => {
    jest.resetAllMocks();
    mediaQueryService = new MediaQueryService();
  });

  describe("matchMedia", () => {
    it("should match media for given query", () => {
      global.matchMedia = jest.fn();

      const mediaQueryMock = "media-query-mock";

      mediaQueryService.matchMedia(mediaQueryMock);

      expect(global.matchMedia).toHaveBeenCalledTimes(1);
      expect(global.matchMedia).toHaveBeenCalledWith(mediaQueryMock);
    });
  });

  describe("prefersColorScheme", () => {
    it("should return true when prefers-color-scheme set to dark", () => {
      global.matchMedia = jest.fn();

      when(global.matchMedia as jest.Mock)
        .calledWith(prefersDarkSchemeQuery)
        .mockReturnValueOnce({ matches: true });

      const prefersColorScheme = mediaQueryService.prefersColorScheme();

      expect(prefersColorScheme).toBe(true);
      expect(global.matchMedia).toHaveBeenCalledTimes(1);
      expect(global.matchMedia).toHaveBeenCalledWith(prefersDarkSchemeQuery);
    });

    it("should return false when prefers-color-scheme set to light", () => {
      global.matchMedia = jest.fn();

      when(global.matchMedia as jest.Mock)
        .calledWith(prefersDarkSchemeQuery)
        .mockReturnValueOnce({ matches: false });

      const prefersColorScheme = mediaQueryService.prefersColorScheme();

      expect(prefersColorScheme).toBe(false);
      expect(global.matchMedia).toHaveBeenCalledTimes(1);
      expect(global.matchMedia).toHaveBeenCalledWith(prefersDarkSchemeQuery);
    });
  });
});
