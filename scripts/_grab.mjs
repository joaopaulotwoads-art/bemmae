import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const f = fs.readFileSync(
  path.join(root, "src/content/posts/melhor-carrinho-de-bebe-travel-system.md"),
  "utf8"
);
const a = '<h2 id="magnific-5-em-1-full-black">';
const b = '<h2 id="spark-plus-duo">';
const out = path.join(__dirname, "_snippet.txt");
fs.writeFileSync(out, f.slice(f.indexOf(a), f.indexOf(b)));
console.log("wrote", out, f.indexOf(b) - f.indexOf(a));
