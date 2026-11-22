import { defineTheme } from "@hyper-elements/react";

// "Ivory & Pine": warm ivory paper, deep charcoal ink, pale mineral cards,
// dark pine used once for the call time, and deep charcoal for inverted safety info.
export const callSheetTheme = defineTheme({
  colors: {
    background: "#fbfbf8",
    foreground: "#141615",
    primary: "#141615",
    primaryForeground: "#fbfbf8",
    primaryHover: "#272b28",
    surface: "#efefe9",
    muted: "#525852", // 7.0:1 on paper, 6.3:1 on mineral cards
    hairline: "#d6d8d0",
    rule: "#141615",
    accent: "#166534", // 6.9:1 on paper
    invertBackground: "#1a1d1b",
    invertForeground: "#fbfbf8",
    invertMuted: "#bfc7c0", // 9.8:1 on inverted safety block
  },
  fonts: {
    body: "'IBM Plex Sans', Helvetica, Arial, sans-serif",
    heading: "'IBM Plex Sans', Helvetica, Arial, sans-serif",
    mono: "'IBM Plex Mono', 'Courier New', monospace",
  },
  spacing: {
    statGap: 2,
    statPad: 12,
  },
  fontSizes: {
    body: 10.5,
    label: 9,
    stat: 15,
    sub: 10.5,
  },
  lineHeights: {
    body: 1.45,
    stat: 1.2,
  },
  radii: { card: 6 },
  elements: {
    // Display weights 400/600 with tight tracking, sentence case everywhere.
    Heading: {
      fontWeight: 600,
      by: {
        level: {
          1: { fontSize: 36, lineHeight: 1, letterSpacing: -1.26 },
          2: { fontSize: 15, lineHeight: 1.2, letterSpacing: -0.3 },
        },
      },
    },
    Button: {
      backgroundColor: "{colors.primary}",
      color: "{colors.primaryForeground}",
      borderRadius: "{radii.card}",
      padding: [14, 24],
      fontSize: 16,
      fontWeight: 600,
      hover: { backgroundColor: "{colors.primaryHover}" },
    },
  },
  styles: {
    card: { backgroundColor: "{colors.surface}", padding: 12, gap: 4, borderRadius: "{radii.card}" },
    invertCard: { padding: 12, gap: 4, borderRadius: "{radii.card}" },
    label: { fontSize: "{fontSizes.label}", fontWeight: 500, color: "{colors.muted}" },
    figure: { fontFamily: "{fonts.mono}", fontWeight: 500 },
    muted: { color: "{colors.muted}" },
    statDivider: { border: { left: { width: 1, style: "solid", color: "{colors.hairline}" } } },
  },
  formats: {
    email: {
      fontSizes: { body: 16, label: 13, sub: 14 },
      lineHeights: { body: 1.5 },
      elements: {
        Heading: {
          by: {
            level: {
              2: { fontSize: 20, lineHeight: 1.2, letterSpacing: -0.4 },
            },
          },
        },
      },
      styles: {
        card: { padding: 16 },
        invertCard: { padding: 16 },
      },
    },
    canvas: {
      spacing: {
        statGap: 4,
        statPad: 24,
      },
      fontSizes: { body: 30, label: 26, stat: 40, sub: 26 },
      lineHeights: { body: 1.35, stat: 1.1 },
      radii: { card: 16 },
      elements: {
        Heading: {
          by: {
            level: {
              1: { fontSize: 64, lineHeight: 1.05, letterSpacing: -2.2 },
            },
          },
        },
      },
      styles: {
        card: { padding: 28 },
        invertCard: { padding: [24, 28] },
        statDivider: { border: { left: { width: 2, style: "solid", color: "{colors.hairline}" } } },
      },
    },
  },
});

declare module "@hyper-elements/react" {
  interface Register {
    theme: typeof callSheetTheme;
  }
}
