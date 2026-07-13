# 🗂️ 文件自动整理工具

自动将杂乱的文件按类型分类到不同文件夹中。

## 用法

**Python 版（推荐）：**
```bash
python organize.py [目标文件夹路径]
```

**Node.js 版：**
```bash
node organize.js [目标文件夹路径]
```

如果不指定路径，默认整理当前文件夹。

## 分类规则

| 文件夹 | 文件类型 |
|--------|----------|
| 📷 图片 | jpg, png, gif, svg, webp, bmp, ico |
| 📄 文档 | pdf, doc, docx, xls, xlsx, ppt, pptx, txt, md, csv |
| 🎬 视频 | mp4, avi, mkv, mov, wmv, flv |
| 🎵 音频 | mp3, wav, flac, aac, ogg, wma |
| 📦 压缩包 | zip, rar, 7z, tar, gz |
| 💻 代码 | js, py, html, css, java, cpp, ts, json, xml |
| 📂 其他 | 不匹配以上类型的文件 |

## 特性

- ✅ 自动创建分类文件夹
- ✅ 重名文件自动重命名，不会覆盖
- ✅ 整理完成后显示统计报告
- ✅ 空文件夹自动跳过

---

Made with Claude Code
