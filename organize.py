# ============================================
# 📂 文件自动整理工具 (Python 版)
# 用法: python organize.py [文件夹路径]
# ============================================

import os
import sys
from pathlib import Path

# 解决 Windows 中文编码问题
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# 分类规则
RULES = {
    '📷_图片':   ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico', '.heic'],
    '📄_文档':   ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md', '.csv', '.rtf'],
    '🎬_视频':   ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
    '🎵_音频':   ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'],
    '📦_压缩包': ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'],
    '💻_代码':   ['.js', '.ts', '.py', '.html', '.css', '.java', '.cpp', '.c', '.json', '.xml', '.yaml', '.yml', '.sh'],
    '🖼️_其他':   [],  # 放所有未匹配的
}

stats = {folder: 0 for folder in RULES}

# 获取目标文件夹
target = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()

if not os.path.exists(target):
    print(f'❌ 文件夹不存在: {target}')
    sys.exit(1)

print(f'🔍 正在整理: {target}\n')

# 获取所有文件（排除文件夹）
files = []
for f in os.listdir(target):
    full = os.path.join(target, f)
    if os.path.isfile(full):
        files.append(f)

if not files:
    print('✅ 没有需要整理的文件')
    sys.exit(0)

# 创建分类文件夹
for folder in RULES:
    folder_path = os.path.join(target, folder)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f'📁 创建文件夹: {folder}')

# 移动文件
for file in files:
    ext = os.path.splitext(file)[1].lower()

    # 找匹配的分类
    category = '🖼️_其他'
    for folder, extensions in RULES.items():
        if folder == '🖼️_其他':
            continue
        if ext in extensions:
            category = folder
            break

    src = os.path.join(target, file)
    dest = os.path.join(target, category, file)

    # 处理重名
    if os.path.exists(dest):
        base, ext2 = os.path.splitext(file)
        counter = 1
        while os.path.exists(dest):
            dest = os.path.join(target, category, f'{base}_({counter}){ext2}')
            counter += 1

    os.rename(src, dest)
    stats[category] += 1
    print(f'  ✅ {file} → {category}/')

# 统计
print(f'\n========== 📊 整理报告 ==========')
total = 0
for folder, count in stats.items():
    if count > 0:
        print(f'  {folder}: {count} 个文件')
        total += count
print(f'  ------------------------------')
print(f'  📦 总计移动: {total} 个文件')
print(f'================================\n')
print('🎉 整理完成！')
