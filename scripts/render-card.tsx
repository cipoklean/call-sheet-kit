// Writes the group-chat card as a PNG (1080x1350) and an SVG.
import { mkdir, writeFile } from "node:fs/promises";
import { ElementsError, formatDiagnostics } from "@hyper-elements/react";
import { layoutImage, renderImage } from "@hyper-elements/react/image";
import { CallSheetCard } from "../src/card";
import { sheet } from "../src/data";
import { loadFonts } from "./fonts";

const design = <CallSheetCard sheet={sheet} />;
await mkdir("out", { recursive: true });

try {
  const fonts = await loadFonts();
  const layout = await layoutImage(design, { fonts, strict: true });
  if (layout.diagnostics.length) console.log(formatDiagnostics(layout.diagnostics));
  const png = await renderImage(design, { fonts, scale: 1, strict: true });
  await writeFile("out/call-sheet-card.png", png.image);
  const svg = await renderImage(design, { fonts, format: "svg", strict: true });
  await writeFile("out/call-sheet-card.svg", svg.image);
  console.log(`wrote out/call-sheet-card.png (${png.width}x${png.height}) and .svg`);
} catch (e) {
  if (!(e instanceof ElementsError)) throw e;
  console.error(formatDiagnostics(e.diagnostics));
  process.exitCode = 1;
}
