import { readFile } from "node:fs/promises";
const f = (p: string) => readFile(new URL(`../fonts/${p}`, import.meta.url));
export async function loadFonts() {
  return [
    { family: "Inter", src: await f("Inter-Regular.otf"), weight: 400 as const },
    { family: "Inter", src: await f("Inter-Medium.otf"), weight: 500 as const },
    { family: "Inter", src: await f("Inter-SemiBold.otf"), weight: 600 as const },
    { family: "Inter", src: await f("Inter-Bold.otf"), weight: 700 as const },
    { family: "Inter", src: await f("Inter-ExtraBold.otf"), weight: 800 as const },
    { family: "JetBrains Mono", src: await f("JetBrainsMono-Medium.ttf"), weight: 500 as const },
    { family: "JetBrains Mono", src: await f("JetBrainsMono-Bold.ttf"), weight: 700 as const },
  ];
}
