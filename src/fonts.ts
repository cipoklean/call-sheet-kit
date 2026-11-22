import type { EmailProps } from "@hyper-elements/react";

/** Web fonts load where a client or browser allows them; elsewhere falls back to Arial and Courier New. */
const PLEX = "https://cdn.jsdelivr.net/fontsource/fonts";

export const webFonts: NonNullable<EmailProps["fonts"]> = ([400, 500, 600] as const).flatMap((weight) => [
  { family: "IBM Plex Sans", src: `${PLEX}/ibm-plex-sans@latest/latin-${weight}-normal.woff2`, format: "woff2" as const, weight },
  { family: "IBM Plex Mono", src: `${PLEX}/ibm-plex-mono@latest/latin-${weight}-normal.woff2`, format: "woff2" as const, weight },
]);
