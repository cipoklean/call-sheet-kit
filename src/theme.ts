import { defineTheme } from "@hyper-elements/react";

// One brand for the PDF, the email and the PNG.
// Ink-black for photocopies, one signal color for anything time-critical.
export const callSheetTheme = defineTheme({
  colors: {
    background: "#ffffff",
    foreground: "#111111",
    primary: "#111111",
    primaryForeground: "#ffffff",
    signal: "#e8590c", // call times, time-critical notes
    muted: "#6b6b6b",
    border: "#d4d4d4",
    rule: "#111111",
    panel: "#f4f2ee",
    danger: "#c92a2a",
  },
  fonts: {
    body: "Inter, Helvetica, Arial, sans-serif",
    heading: "Inter, Helvetica, Arial, sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
  fontSizes: { body: 11 },
  lineHeights: { body: 1.35 },
  elements: {
    Heading: {
      fontWeight: 800,
      letterSpacing: -0.2,
      by: { level: { 1: { fontSize: 30 }, 2: { fontSize: 13, textTransform: "uppercase", letterSpacing: 1.2 }, 3: { fontSize: 11 } } },
    },
    Button: { borderRadius: 4, padding: [12, 20], fontWeight: 700 },
  },
  styles: {
    label: { fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "{colors.muted}" },
    panel: { backgroundColor: "{colors.panel}", padding: 12, gap: 4, borderRadius: 4 },
  },
});
