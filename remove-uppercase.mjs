import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let stat = fs.statSync(dirPath);
        if (stat.isDirectory()) {
            walk(dirPath, callback);
        } else {
            if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
                callback(dirPath);
            }
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    content = content.replace(/(["'`])(.*?)\1/g, (match, quote, inner) => {
        if (inner.includes('uppercase')) {
            let parts = inner.split(/(\s+)/); // keep whitespace
            
            // Check if 'uppercase' or 'sm:uppercase' etc is in the classes
            let isUppercaseClass = parts.some(p => p.endsWith('uppercase') && p.trim().length > 0);
            
            if (isUppercaseClass) {
                let newParts = parts.map(p => {
                    if (p.endsWith('uppercase')) return '';
                    if (p.includes('tracking-')) return '';
                    if (p === 'font-black') return 'font-bold';
                    if (p === 'font-extrabold') return 'font-bold';
                    if (p === 'text-[9px]') return 'text-[10px]';
                    if (p === 'text-[10px]') return 'text-[11px]';
                    if (p === 'text-[11px]') return 'text-[12px]';
                    return p;
                });
                
                // Clean up multiple spaces that might have been introduced
                let newInner = newParts.join('');
                newInner = newInner.replace(/\s+/g, ' ').trim();
                
                return quote + newInner + quote;
            }
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

console.log("Starting script...");
walk('/Users/hasan/Desktop/Sadece teklif/SadeceTeklif-nextjs/app', processFile);
walk('/Users/hasan/Desktop/Sadece teklif/SadeceTeklif-nextjs/components', processFile);
console.log("Done");
