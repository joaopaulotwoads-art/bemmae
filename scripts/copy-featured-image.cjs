const fs = require('fs');
const path = require('path');

const src = path.join(
  process.env.USERPROFILE,
  '.cursor', 'projects', 'c-Users-Jo-o-Desktop-f8-main', 'assets',
  'c__Users_Jo_o_AppData_Roaming_Cursor_User_workspaceStorage_a6a5d86e7bb2ba1054611a40b9a41bf3_images_familia-passeando-no-parque-com-seu-filho-no-carrinho-de-bebe-db1980a5-ab6a-4200-8b3a-c4c3a07af071.png'
);
const dest = path.join(__dirname, '..', 'public', 'melhor-carrinho-de-bebe.png');

if (!fs.existsSync(src)) {
  console.error('Source image not found at:', src);
  process.exit(1);
}
fs.copyFileSync(src, dest);
console.log('Copied to', dest);
