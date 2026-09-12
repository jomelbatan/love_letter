export {};

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
    };
    fbAsyncInit?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
  }
}
