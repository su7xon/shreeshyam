const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /text-white/g, replace: 'text-gray-900' },
  { search: /text-\[#e5e7eb\]/g, replace: 'text-gray-900' },
  { search: /text-\[#9ca3af\]/g, replace: 'text-gray-600' },
  { search: /text-\[#6b7280\]/g, replace: 'text-gray-500' },
  { search: /text-\[#94a3b8\]/g, replace: 'text-gray-600' },
  { search: /text-\[#64748b\]/g, replace: 'text-gray-500' },
  { search: /text-\[#4b5563\]/g, replace: 'text-gray-500' },
  { search: /bg-\[#1e293b\]/g, replace: 'bg-gray-50' },
  { search: /bg-\[#0f1117\]/g, replace: 'bg-white' },
  { search: /bg-\[#0a0c10\]/g, replace: 'bg-gray-100' },
  { search: /bg-\[#0c0f14\]/g, replace: 'bg-gray-200' },
  { search: /border-white\/5/g, replace: 'border-gray-200' },
  { search: /border-white\/10/g, replace: 'border-gray-300' },
  { search: /bg-white\/5(?![0-9])/g, replace: 'bg-gray-100' },
  { search: /bg-white\/10/g, replace: 'bg-gray-200' },
  { search: /hover:text-white/g, replace: 'hover:text-gray-900' },
  { search: /bg-white\/\[0\.02\]/g, replace: 'bg-gray-50' },
  { search: /bg-white\/\[0\.04\]/g, replace: 'bg-gray-100' },
  { search: /bg-white\/\[0\.06\]/g, replace: 'bg-gray-200' },
  { search: /border-white\/\[0\.04\]/g, replace: 'border-gray-200' },
  { search: /border-white\/\[0\.08\]/g, replace: 'border-gray-300' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.search, rule.replace);
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

const adminDir = path.join(__dirname, 'src', 'app', 'admin');
const adminCompDir = path.join(__dirname, 'components', 'admin');

if (fs.existsSync(adminDir)) processDirectory(adminDir);
if (fs.existsSync(adminCompDir)) processDirectory(adminCompDir);

console.log('Done replacing colors.');
