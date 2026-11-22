import { mkdir, writeFile } from "node:fs/promises";
import { ElementsError, formatDiagnostics, outline, render, validate } from "@hyper-elements/react";
import { renderPdf } from "@hyper-elements/react/pdf";
import { CallSheetPdf } from "../src/pdf";
import { sheet } from "../src/data";
import { loadFonts } from "./fonts";

const design = <CallSheetPdf sheet={sheet} />;
await mkdir("out", { recursive: true });
const report = validate(design);
if (report.diagnostics.length) console.log(formatDiagnostics(report.diagnostics));
if (process.argv.includes("--outline")) console.log(outline(design));
try {
  const { html } = await render(design);
  await writeFile("out/call-sheet.print.html", html);
  const { pdf, diagnostics } = await renderPdf(design, { fonts: await loadFonts() });
  if (diagnostics.length) console.log(formatDiagnostics(diagnostics));
  await writeFile("out/call-sheet.pdf", pdf);
  console.log("wrote out/call-sheet.pdf");
} catch (e) {
  if (!(e instanceof ElementsError)) throw e;
  console.error(formatDiagnostics(e.diagnostics));
  process.exitCode = 1;
}
