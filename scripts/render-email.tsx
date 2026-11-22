// Renders the morning email once, checks it against 11 email clients, writes one
// personalised copy per crew member, and (with --preview) the client previews.
import { mkdir, writeFile } from "node:fs/promises";
import { ElementsError, formatDiagnostics, render } from "@hyper-elements/react";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";
import { CallSheetEmail } from "../src/email";
import { nb } from "../src/elements";
import { sheet } from "../src/data";

const design = <CallSheetEmail sheet={sheet} />;
const plugins = [await emailClients()];

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

await mkdir("out/email/crew", { recursive: true });

try {
  const { html, text, diagnostics } = await render(design, { plugins });
  if (diagnostics.length) console.log(formatDiagnostics(diagnostics));
  await writeFile("out/email/call-sheet.email.html", html);
  await writeFile("out/email/call-sheet.email.txt", text);

  // What a sending service does with the merge tags, done locally for every crew member.
  const fill = (s: string, v: Record<string, string>) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k) => escapeHtml(v[k] ?? ""));
  let count = 0;
  for (const dept of sheet.departments) {
    for (const p of dept.crew) {
      const values = {
        crew_name: p.name.split(" ")[0],
        crew_role: p.role,
        call_time: nb(p.call),
        crew_note: p.note ? ` · Note: ${nb(p.note)}` : "",
      };
      const slug = p.name.toLowerCase().replace(/[^a-z]+/g, "-");
      await writeFile(`out/email/crew/${slug}.html`, fill(html, values));
      count++;
    }
  }
  console.log(`wrote out/email/call-sheet.email.html and ${count} crew copies`);

  if (process.argv.includes("--preview")) {
    // Preview one filled copy via Hyper Elements' native mergeTag hook, keeping client diagnostics mapped to elements.
    const sampleValues: Record<string, string> = {
      crew_name: "Kenji",
      crew_role: "DP",
      call_time: nb("6:30 AM"),
      crew_note: "",
    };
    const { previews, skipped } = await renderInEmailClients(design, {
      emailClients: ["outlook", "outlook-com", "gmail", "gmail-app", "apple-mail"],
      dark: true,
      computers: ["windows"],
      fonts: "inline",
      mergeTag: (name) => escapeHtml(sampleValues[name] ?? `{{${name}}}`),
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
