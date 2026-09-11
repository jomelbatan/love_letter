import localFont from "next/font/local";

export const yuyu = localFont({
  src: [{ path: "../fonts/Yuyu-Regular.ttf" }],
  variable: "--font-yuyu-family",
});
export const kalam = localFont({
  src: [{ path: "../fonts/Kalam-Regular.ttf" }],
  variable: "--font-kalam-family",
});
export const kalamBold = localFont({
  src: [{ path: "../fonts/Kalam-Bold.ttf" }],
  variable: "--font-kalam-bold-family",
});
