import fs from "fs";
const t = fs.readFileSync(
  "src/content/posts/melhor-carrinho-de-bebe-travel-system.md",
  "utf8"
);
const endFm = t.indexOf("\n---\n", 4);
const fm = t.slice(0, endFm + 5);
const body = t.slice(endFm + 5);
console.log(JSON.stringify({ fmLen: fm.length, bodyLen: body.length }));
