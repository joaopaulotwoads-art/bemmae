import fs from "fs";
const t = fs.readFileSync(
  "src/content/posts/melhor-carrinho-de-bebe-travel-system.md",
  "utf8"
);
const endFm = t.indexOf("\n---\n", 4);
const body = t.slice(endFm + 5);
const first = body.indexOf('<h2 id="mobi-nv-trio-safety-1st">');
const second = body.indexOf('<h2 id="reverse-duo-cosco">');
console.log(body.slice(first, second));
