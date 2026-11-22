// Renders the morning email once, checks it against 11 email clients, writes one
// personalised copy per crew member, and (with --preview) the client previews.
import { mkdir, writeFile } from "node:fs/promises";
import { ElementsError, formatDiagnostics, render, validate } from "@hyper-elements/react";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";
import { CallSheetEmail } from "../src/email";
import { sheet } from "../src/data";

const design = <CallSheetEmail sheet={sheet} sheetUrl="https://saltmarsh.example/low-tide/day-7.pdf" />;
const plugins = [await emailClients()];

await mkdir("out/email/crew", { recursive: true });
const report = validate(design, { plugins });
if (report.diagnostics.length) console.log(formatDiagnostics(report.diagnostics));

try {
  const { html, text } = await render(design, { plugins });
  await writeFile("out/email/call-sheet.email.html", html);
  await writeFile("out/email/call-sheet.email.txt", text);

  // What a sending service does with the merge tags, done locally for every crew member.
  const fill = (s: string, v: Record<string, string>) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => v[k] ?? "");
  let count = 0;
  for (const dept of sheet.departments) {
    for (const p of dept.crew) {
      const values = { crew_name: p.name.split(" ")[0], crew_role: p.role, call_time: p.call };
      const slug = p.name.toLowerCase().replace(/[^a-z]+/g, "-");
      await writeFile(`out/email/crew/${slug}.html`, fill(html, values));
      count++;
    }
  }
  console.log(`wrote out/email/call-sheet.email.html and ${count} crew copies`);

  if (process.argv.includes("--preview")) {
    // Preview one filled copy, as a crew member receives it.
    const sample = fill(html, { crew_name: "Kenji", crew_role: "DP", call_time: "6:30 AM" });
    const { previews, skipped } = await renderInEmailClients(sample, {
      emailClients: ["outlook", "outlook-com", "gmail", "gmail-app", "apple-mail"],
      dark: true,
      computers: ["windows"],
      fonts: "inline",
    });
    await mkdir("out/email/previews", { recursive: true });
    for (const p of previews) await writeFile(`out/email/previews/${p.filename}`, p.html);
    console.log(`previews: ${previews.map((p) => p.filename).join(", ")}`);
    if (skipped.length) console.log("skipped:", skipped);
  }
} catch (e) {
  if (!(e instanceof ElementsError)) throw e;
  console.error(formatDiagnostics(e.diagnostics));
  process.exitCode = 1;
}
