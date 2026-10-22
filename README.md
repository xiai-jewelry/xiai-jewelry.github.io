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
- 首页轮播（左右无边框，参考雪洛 xueluopearl.com）：`images/home/slide-1…3`，顺序和文案在 `build_site.py` 的 `SLIDES` 里，第 4 页是视频（`FILM`）。电脑上铺满首屏、自动翻页（6 秒一张，翻到视频停下；访客一点击就不再自动翻），手机上是方图，文字在图下面。
- 首页「As worn」人物试戴：`images/home/worn-*.jpg` 和展厅照片 `showroom-14157.jpg`，顺序和说明在 `TRY_ON` 里；后面接着原来的三张模特图。
- 模特图：`images/campaign/`，是用 Canva AI 以真品图为参考生成的；`build_site.py` 里的 `CAMPAIGN` 决定哪张图用在哪里，每张图必须对应一款真实货号。
- 页面往下滑时的文字/图片上浮效果在 `assets/site.js` 末尾（`Scroll-in effects`），系统设置了「减少动态效果」的访客不会看到动画。
- 首页视频：轮播第 4 页，`media/xiai-film.mp4`（1280×720，H.264 + AAC，`-movflags +faststart`），封面 `images/film-poster.jpg`；翻到这一页才开始加载和播放。
- 配色（奶咖·米色）：页面底色 #F8F5F0，分区燕麦米 #EFE7DC，小面积奶咖 #E0D2C2，细线暖沙棕 #B89C83，按钮和链接浓咖棕 #6C5242，文字深咖墨 #332B26，辅助文字 #706258；都在 `assets/site.css` 开头的 `:root` 里。

## 部署
- GitHub Pages：把整个目录同步到 `xiai-jewelry/xiai-jewelry.github.io` 仓库的 main 分支。旧仓库 `Sophia-ZHANG101.github.io` 只放跳转页，用 `python3 scripts/make_redirects.py <旧仓库目录>` 生成。
- Vercel：推送本仓库 main 分支即可自动部署。
