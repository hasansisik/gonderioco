import fs from 'fs';
let content = fs.readFileSync('/Users/hasan/Desktop/Sadece teklif/SadeceTeklif-nextjs/app/panel/magaza/page.tsx', 'utf-8');
let match = content.match(/(["'`])(.*?uppercase.*?)\1/g);
console.log("Matches:", match ? match.slice(0, 5) : "None");
