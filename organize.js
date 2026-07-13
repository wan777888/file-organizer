// ============================================
// 📂 文件自动整理工具
// 用法: node organize.js [文件夹路径]
// ============================================

const fs = require('fs');
const path = require('path');

// 分类规则 — 按扩展名映射到目标文件夹
const RULES = {
  '📷_图片':    ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico', '.heic'],
  '📄_文档':    ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md', '.csv', '.rtf'],
  '🎬_视频':    ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
  '🎵_音频':    ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
  '📦_压缩包':  ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'],
  '💻_代码':    ['.js', '.ts', '.py', '.html', '.css', '.java', '.cpp', '.c', '.json', '.xml', '.yaml', '.yml', '.sh'],
  '🖼️_其他':   [], // 兜底，放所有未匹配的
};

// 统计
const stats = {};
Object.keys(RULES).forEach(k => stats[k] = 0);

// 目标文件夹
const targetDir = process.argv[2] || process.cwd();

if (!fs.existsSync(targetDir)) {
  console.log(`❌ 文件夹不存在: ${targetDir}`);
  process.exit(1);
}

console.log(`🔍 正在整理: ${targetDir}\n`);

// 读取所有文件（排除文件夹和当前脚本自身）
const files = fs.readdirSync(targetDir).filter(name => {
  const fullPath = path.join(targetDir, name);
  return fs.statSync(fullPath).isFile();
});

if (files.length === 0) {
  console.log('✅ 没有需要整理的文件');
  process.exit(0);
}

// 创建分类文件夹
for (const folder of Object.keys(RULES)) {
  const folderPath = path.join(targetDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 创建文件夹: ${folder}`);
  }
}

// 移动文件
for (const file of files) {
  const ext = path.extname(file).toLowerCase();

  // 找到匹配的分类
  let category = '🖼️_其他';
  for (const [folder, extensions] of Object.entries(RULES)) {
    if (folder === '🖼️_其他') continue;
    if (extensions.includes(ext)) {
      category = folder;
      break;
    }
  }

  const src = path.join(targetDir, file);
  let dest = path.join(targetDir, category, file);

  // 处理重名文件
  if (fs.existsSync(dest)) {
    const baseName = path.basename(file, ext);
    let counter = 1;
    while (fs.existsSync(dest)) {
      dest = path.join(targetDir, category, `${baseName}_(${counter})${ext}`);
      counter++;
    }
  }

  fs.renameSync(src, dest);
  stats[category]++;
  console.log(`  ✅ ${file} → ${category}/`);
}

// 打印统计
console.log(`\n========== 📊 整理报告 ==========`);
let total = 0;
for (const [folder, count] of Object.entries(stats)) {
  if (count > 0) {
    console.log(`  ${folder}: ${count} 个文件`);
    total += count;
  }
}
console.log(`  ------------------------------`);
console.log(`  📦 总计移动: ${total} 个文件`);
console.log(`================================\n`);
console.log('🎉 整理完成！');
