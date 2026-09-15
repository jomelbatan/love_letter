/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    FB: {
      XFBML: {
        parse: (element?: HTMLElement | null) => void;
      };
    };
    fbAsyncInit?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    instgrm: {
      Embeds: { process: (element?: HTMLElement | null) => void };
    };
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
