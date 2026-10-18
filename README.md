# XIAI Jewelry Website · 玺爱官网

玺爱珠宝品牌官网（静态多页面网站）。正式地址 https://xiai-jewelry.github.io （GitHub Pages，国内可访问；旧地址 sophia-zhang101.github.io 自动跳转到这里）；Vercel 上的 xiai-website.vercel.app 为备用，国内访问不稳定。

## 页面
- `/` 首页 · `/products` 全部产品 · `/products/<品类>` 品类页（necklaces / earrings / rings / bracelets / pendants / brooches）
- `/products/<货号>` 产品详情页（32 款）
- `/pearl-guide` 珍珠指南 · `/our-story` 品牌故事 · `/wholesale` 批发与定制 · `/contact` 联系与常见问题

## 怎么改
- 产品资料：`data/products.json`（名称、参数、文案、FAQ、图片），全部来自企业 SKU 信息收集表，不要加表里没有的款式。
- 页面结构和文案：`scripts/build_site.py`；样式：`assets/site.css`；交互：`assets/site.js`。
- 改完运行 `python3 scripts/build_site.py`，会重新生成所有 HTML 和 `sitemap.xml`（不要手改生成出来的 HTML）。
- 产品图：`images/products/<货号>/`（白底原图，最长边 1400px，已去掉带水印/海报字的图）。
- 模特图：`images/campaign/`，是用 Canva AI 以真品图为参考生成的，页面上都标注了「AI-generated」；`build_site.py` 里的 `CAMPAIGN` 决定哪张图用在哪里，每张图必须对应一款真实货号。首页轮播（左右翻页）就是这几张图。
- 首页视频：无边框铺满首屏（导航栏下方）。`media/xiai-film.mp4`（1280×720，电脑用）和 `media/xiai-film-portrait.mp4`（从同一视频中间裁出的 450×720 竖版，手机用），封面 `images/film-poster.jpg`。换视频时用 ffmpeg 压成 H.264 + AAC、加 `-movflags +faststart`，两个版本都换掉（竖版用 `crop=450:720:(in_w-450)/2:0`）。
- 配色（奶咖·米色）：页面底色 #F8F5F0，分区燕麦米 #EFE7DC，小面积奶咖 #E0D2C2，细线暖沙棕 #B89C83，按钮和链接浓咖棕 #6C5242，文字深咖墨 #332B26，辅助文字 #706258；都在 `assets/site.css` 开头的 `:root` 里。

## 部署
- GitHub Pages：把整个目录同步到 `xiai-jewelry/xiai-jewelry.github.io` 仓库的 main 分支。旧仓库 `Sophia-ZHANG101.github.io` 只放跳转页，用 `python3 scripts/make_redirects.py <旧仓库目录>` 生成。
- Vercel：推送本仓库 main 分支即可自动部署。
