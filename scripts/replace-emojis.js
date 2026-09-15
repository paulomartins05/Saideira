const fs = require('fs');
const path = require('path');

const emojiMap = {
  '🏷️': 'Tag',
  '🍴': 'Utensils',
  '📷': 'Camera',
  '➕': 'Plus',
  '📦': 'Package',
  '📝': 'FileText',
  '🍛': 'Utensils',
  '🍱': 'Archive',
  '🍮': 'Coffee',
  '🥤': 'CupSoda',
  '🥖': 'Croissant',
  '🥟': 'Croissant',
  '🍩': 'Donut',
  '🍰': 'Cake',
  '🍎': 'Apple',
  '🥐': 'Croissant',
  '🥩': 'Beef',
  '🛒': 'ShoppingCart',
  '🎂': 'Cake',
  '🍬': 'Candy',
  '🥧': 'Pizza',
  '👋': 'Hand',
  '⚠️': 'AlertTriangle',
  '✅': 'CheckCircle',
  '❌': 'XCircle',
  '🚀': 'Rocket',
  '⭐': 'Star',
  '📍': 'MapPin',
  '🕒': 'Clock',
  '💲': 'DollarSign',
  '🔥': 'Flame',
  '🔒': 'Lock',
  '🔑': 'Key',
  '💰': 'BadgeDollarSign',
  '🎉': 'PartyPopper',
  '🍽️': 'Utensils',
  '🍕': 'Pizza',
  '🍔': 'Sandwich',
  '🌭': 'HotDog',
  '🍖': 'Drumstick',
};

const commonIcons = new Set(Object.values(emojiMap));

function replaceEmojis(content) {
  let modified = false;
  let usedIcons = new Set();
  
  const escapedKeys = Object.keys(emojiMap).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regexString = `(["'\`])?(${escapedKeys})\\1?`;
  const regex = new RegExp(regexString, 'g');
  
  const newContent = content.replace(regex, (match, quote, emoji) => {
    modified = true;
    const iconName = emojiMap[emoji];
    usedIcons.add(iconName);
    
    // Se estava entre aspas (ex: icon: "🍎" ou placeholder="🍎"), substituímos sem aspas!
    // Nota: isso pode quebrar placeholders, mas se for em objeto (icon: "🍎"), vai transformar em icon: <Apple ... /> que  o correto.
    // Para placeholders, como no suporta SVG, substitumos por nada ou tentamos manter sem aspas se quebrar o jsx (na verdade, quebra sim se for prop= placeholder={<Apple />}).
    // Vamos substituir por <Icon className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" />
    
    return `<${iconName} className="w-[1.2em] h-[1.2em] inline-block align-text-bottom" />`;
  });
  
  if (modified) {
    // Injetar imports
    const iconsToImport = Array.from(usedIcons).join(', ');
    const importStatement = `import { ${iconsToImport} } from "lucide-react";\n`;
    
    // Tenta encontrar o ltimo import para adicionar depois
    const importMatches = Array.from(newContent.matchAll(/^import .* from .*$/gm));
    let finalContent = newContent;
    if (importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const insertIndex = lastImport.index + lastImport[0].length;
      finalContent = newContent.slice(0, insertIndex) + '\n' + importStatement + newContent.slice(insertIndex);
    } else {
      finalContent = importStatement + newContent;
    }
    
    // Tratamento especfico para placeholders que agora tem JSX e precisam de {} se estivessem com "" 
    // Exemplo: placeholder={<Icon .../>} e no placeholder=<Icon... />
    finalContent = finalContent.replace(/placeholder=<([a-zA-Z]+)([^>]+)\/>/g, 'placeholder={""}');
    
    return { modified: true, content: finalContent };
  }
  
  return { modified: false, content };
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        walk(file);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(file, 'utf8');
      const result = replaceEmojis(content);
      if (result.modified) {
        fs.writeFileSync(file, result.content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  });
}

walk(path.resolve(__dirname, '../app'));
walk(path.resolve(__dirname, '../lib'));
console.log('Done!');
