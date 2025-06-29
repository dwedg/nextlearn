1.目录结构：
+ /app:应用核心目录，包含所有路由、组件和业务逻辑，开发过程中主要工作区域。
+ /app/lib:公共函数库，存放可复用的工具函数（如数据处理工具）和数据获取方法。
+ /app/ui:UI组件库，包含预置样式的卡片、表格、表单等界面组件（课程中已预先完成样式设计，可直接调用）。
+ /public:静态资源目录，存储图片等无需编译的静态文件。
+ 项目根目录下的next.config.ts等配置文件
------
2.Next.js能欧自动检测项目是否采用了typescript.并只能安装相关依赖包及配置。同时，Nextjs内置了针对代码编辑器的typescript插件，可提供以下开发支持：
+ 零配置集成：创建项目时，若检测到.ts/.tsx文件，自动安装typescript,@type/react等必备依赖。生成默认tsconfig.json配置文件（已针对Next.js优化）
+ 开发增强：类型安全校验（实时检测类型错误，如错误的props传递）；智能补全：（编辑器自动提示props类型，api路由参数）；类型定义支持（内置next/types类型声明，开箱即用）
-------

3.nextjs/font模块，会自动优化字体加载。
+ 构建时处理：nextjs会在构建阶段下载字体，并将它与其他静态资源(css,js)一起托管。
+ 性能优势：用户访问应用时，字体文件无需额外网络请求，从而避免因字体加载导致的性能损耗。

✅next/font/xxxx模块下有Next。js提供的官方字体优化模块。
以Google字体为例
```javascript
import { Inter } from 'next/font/google';
export const inter = Inter({ subsets: ['latin'] });
```
+ 从 Google Fonts 引入的 Inter 字体家族（一个流行的无衬线字体）。
+ Inter()方法：创建字体配置实例的方法调用。配置参数:subsets: ['latin']：指定仅加载拉丁字符集（减少字体文件体积）。其他可选字符集：['latin-ext', 'cyrillic'] 等，根据实际需求添加。返回一个字体配置对象 inter，包含：自动生成的 CSS 变量（如 --font-inter）；类名（如 className="font-inter"）；内联样式所需的 CSS 属性。

✅ 使用
+ 全局css变量：通过inter.className自动生成应用字体家族（生成类似.font-inter{font-family:Inter,sans-serif;}的样式）。
```typescript
import {inter} from './fonts'
export default function RootLayout({children}){
  return (
    <html lang='en' className = {inter.className}>
      <body>{children}</body>
    </html>
  )
}
```
+ CSS-in-JS：直接使用inter.style内联样式（包含fontFamily属性）
```typescript
// 组件内使用
<div style={inter.style}>Hello World</div>
```

✅扩展配置选项
```typescript
const inter=Inter({
    subsets: ['latin'],
    weight: ['400', '700'],       // 明确需要的字重（默认400）
    style: 'normal',              // 或 'italic'
    variable: '--my-font',        // 自定义CSS变量名
    display: 'swap',              // 字体加载策略
})
```

-----
4.next的`<Image>`组件是对html标签的扩展，具有的图像优化特性有：
+ 布局稳定性优化：自动防止图片加载时导致的布局偏移（Layout Shift）。
+ 智能尺寸适配：根据视窗大小自动调整图片尺寸，避免向小屏幕设备传输过大图片资源。
+ 延迟加载机制：默认启用懒加载机制，图像仅在进入可视区域进行时加载。
+ 现代化格式支持：根据浏览器兼容性自动提供 WebP/AVIF 等新一代图像格式（在支持环境下）

该组件的图片的引入方法
|src写法|图片来源|实际路径说明|
|----|----|----|
|src='/img/a.jpg'|本地public|实际是public/img/a.jpg|
|src='https://example.com/xx.jpg'|网络图片|该图片的域名必须列入next.config.js的domains|
|src={import路径}|静态导入|构建时自动转为图片路径并优化处理|

+ 该组件的width和height是必需属性，它的作用并非实际渲染尺寸，而是用于确定图片的宽高比（ratio）正确设置可避免页面布局抖动。（layout shift）

-------
5. nextjsAppRouter中的特殊文件名
+ page.tsx：页面组件，会被映射为一个路由
+ layout.tsx：页面布局组件，可嵌套，持久存在
+ template.tsx：动态模版布局，每次导航会重新渲染
+ loading.tsx:页面或路由块加载时的 loading UI
+ error.tsx:页面出错时的错误边界处理组件
+ not-found.tsx:当前路由未匹配时显示的 404 页
+ head.tsx:自定义 `<head> `标签内容
+ route.ts / route.js,用于处理 API 路由（App Router 版本的 API Routes）
+ default.tsx,用于 Slot（插槽）的默认组件（可选）

------
6. nextjs创建一个路由的方法是，在/app的目录下创建一个新的目录(假如是newFile)，并在该目录下添加一个page.tsx文件，则访问http://xxxx/newFile,呈现的就是newFile文件夹中page.jsx文件导出的组件内容。
+ 可以将路由相关的UI组件，测试文件和其他代码集中存放在同一目录下。
```text
/app
  /dashboard
    page.js       # 路由页面
    Chart.js      # 该页面专用组件
    test-utils.js # 测试工具
  /ui            # 共享 UI 组件库
  /lib           # 公共工具库
```
+ 只有带有page.tsx的目录的文件内容会作为公开路由端点。同目录下的其他文件（如组件/工具）默认不可直接通过 URL 访问
+ Next.js 的文件路由系统只把 page.tsx 视为路由入口，其他放在同级目录下的组件、工具库、测试等文件不会自动变成页面，这样可以让你的项目结构更整洁、模块更集中。

-------
7. layout.tsx文件是跨页面共享结构（如导航、主题）为多个页面创建共享布局。它定义的是一个可嵌套、持久存在的布局组件，包裹住了所有子页面内容，并且不会在页面跳转时卸载。可以用来定义页面或路由段的公共布局，像导航栏，侧边栏，底部栏。
+ 与page.tsx配合使用，layout.tsx负责结构，page.tsx负责内容。
```bash
app/
├── layout.tsx             → 整站布局
├── page.tsx               → `/`
├── blog/
│   ├── layout.tsx         → `/blog` 专属布局
│   └── [slug]/
│       └── page.tsx       → `/blog/my-post`
```
上面/blog/my-post 实际上是被两个 layout 包裹的：根布局：app/layout.tsx；博客布局：app/blog/layout.tsx
+ 每个layout必须返回完整的html结构（顶层 layout 需要包含 `<html>` 和` <body>`）
+ layout也可以有自己的loading.tsx,error.tsx,not-found.tsx

-------
7.定义在/app/layout.tsx中的UI会应用于所有页面。可修改 `<html>/<body>` 标签.支持注入全局 metadata（通过 export const metadata）.这种设计既保持了全局一致性（通过根布局），又实现了路由组的UI隔离（通过嵌套布局）。

-----
8.Next.js 路由优化的核心
+ 自动化路由级代码分割:传统 SPA 问题：浏览器初始化时需加载全量应用代码,Next.js 方案：按路由片段自动拆分代码，实现： 错误隔离：单页面异常不影响整体应用;性能提升：减少浏览器首屏解析的代码量.
+ 智能预加载机制:`<Link>` 组件工作流程：当链接出现在可视视口时,Next.js 在后台静默预加载目标路由代码,用户点击时，页面实现 瞬时切换（near-instant transition）

------
9.文件标记'use client'作用：标记该组件需要在浏览器环境执行。但是整个nextjs应用是混合渲染的，同时利用服务端和客户端能力。
---
10.Nextjs服务端核心工作流程
+ 请求阶段（nodejs运行时）
  + 路由匹配：服务端根据请求路径（如、products/123）匹配对应的页面组件（如 app/product/[id]/page.tsx）。
  + 数据获取：若组件中包含服务端数据获取方法，会按优先级一次执行：
    ```typescript
    //三种服务端数据获取方式
    const data = await fetch(....)//直接fetch(推荐)
    const data = await getServerSidePage()//传统Pages Router
    const data = await db.query();//Server Component 直接操作数据库
    ```
+ 渲染阶段
  + 组件数构建：服务端会按层级渲染 React 组件树，但分为两种处理方式：

    ✅服务端组件：直接在nodejs环境渲染为静态HTML片段，不包含Ract hydration代码（减少客户端负担）
    ```typescript
    //服务端组件实例（可直接访问数据库）
    export default async function Page(){
      const posts =await db.posts.findMany();
      return <PostList posts={posts}/>//渲染为纯HTML
    }
    ```
    ✅客户端组件：渲染为 占位符 并标记需客户端 hydrate，同时生成关联的 JavaScript 代码（存于 .next/static）
  + 混合输出:最终生成包含以下内容的 HTML：
  ```html
    <!DOCTYPE html>
    <html>
      <body>
        <!-- 服务端组件的静态 HTML -->
        <div id="post-list">
          <div class="post">Post 1</div> 
        </div>
        
        <!-- 客户端组件的占位符 + hydration 指令 -->
        <div id="comments" data-react-props="{...}"></div>
        <script src="/_next/static/chunks/comments.js"></script>
      </body>
    </html>
  ```
+ 响应阶段
  + 流式响应（Streaming）：现代 Next.js 默认启用渐进式渲染，先返回页面骨架（如导航栏），再分块发送动态内容， （如 loading.tsx 占位符），最后注入客户端交互逻辑。
  + 静态优化：若页面标记为 dynamic = 'force-static'，则跳过数据获取直接返回缓存 HTML。

------
11. Nextjs与传统SSR框架的区别
|特性|Next.js|传统SSR|
|----|----|----|
|数据获取|组件级声明（fetch/db）|全局请求处理|
|输出类型|混合HTML+部分hydrate|纯html|
|交互能力|自动客户端hydrate|需手动绑定 js|
|流式渲染|支持分块传输|通常一次性输出|

------
12.Nextjs生产环境实际执行示例：以https://example.com/products/42为例
+ CDN 检查：若页面已静态化（SSG），直接返回缓存 HTML
+ Node.js 处理动态请求：调用 db.product.find(42) 获取数据；渲染 app/products/[id]/page.tsx 为 HTML；注入 `<script> `标签指向客户端 JS
+ 浏览器接收：立即显示静态html,异步加载js完成hydrate(恢复交互性)

------
13.Vercel 是 Next.js 官方推荐的云部署平台，专为现代前端和全栈应用优化.
+ 自动化全球部署,一键发布：关联 Git 仓库后，每次 git push 自动触发构建和部署。边缘网络：将静态资源（HTML/CSS/JS）分发到全球 100+ 个 CDN 节点，实现毫秒级加载。
+ 智能托管 Next.js 全栈能力。
|功能|Vercel的实现方式|传统服务器相比|
|----|----|----|
|服务渲染（ssr）|自动将getServerSideProps转为Serverless Function|需手动配置nodejs集群|
|API路由|page/api/*或app/api/*自动转为无服务函数|需自动转为无服务函数|需自建后端服务|
|静态生成(SSG)|预渲染页面直接存入CDN|需配置静态文件服务器|

+  深度 Next.js 集成：

✅增量静态再生 (ISR)：动态页面按需重新生成并缓存：
```typescript
// 页面配置
export const revalidate = 60; // 每60秒重新验证数据
```
✅图像优化：自动应用next/image的WebP/AVIF 转换和尺寸优化。

✅边缘中间件：通过 middleware.ts 在 CDN 边缘运行逻辑（如 A/B 测试、鉴权）。
+ 开发者体验优化

✅ 预览环境：每个 Git 分支自动生成独立可访问的 URL（用于代码审查）。

✅ 性能监控：内置 Lighthouse 评分和 Web Vitals 跟踪。

✅ Serverless 免运维：自动扩展函数实例，无需管理服务器。

+ 典型工作流程

✅ 开发阶段：本地 next dev 调试
✅ 提交代码：git push main
✅ Vercel 自动化：安装依赖（npm install），构建项目（npm run build）拆分资源（静态文件 → CDN，动态路由 → Serverless）
✅ 全球发布：DNS 自动配置 + SSL 证书生成
------

13.vercel适用于需要Nextjs全栈能力（SSR/ISR/API）,追求极简部署流程和全球性能，以及中小项目或快速原型开发的场景。

------
14.Nextjs获取数据的方式有2种。
+ API 端点开发：构建 API 接口时需编写数据库交互逻辑（传统模式）：也就是常见的终端请求api获取数据后，再在终端把获取的数据传递给react
```typescript
// 示例：Next.js API 路由 (位于 `app/api/users/route.ts`)
export async function GET() {
  // 此代码在服务端 Node.js 环境运行，浏览器看不到
  const users = await sql`SELECT * FROM users`; // 直接执行 SQL
  return Response.json(users); // 仅返回结果给浏览器
}
```
+ React 服务端组件优化方案,使用 Next.js 的 Server Components 时，可直接在服务端查询数据库，无需额外 API 层
```typescript
 // app/page.tsx
export default async function Page() {
  const posts = await prisma.post.findMany(); // 直接操作数据库
  return <PostList posts={posts} />; 
}
```
两种安全数据获取方式对比
|方式|执行环境|优点|适用场景|
|----|----|----|----|
|API 端点查询|服务端|隐藏数据库细节，可做权限控制|需要开放给第三方调用的接口|
|Server Component 直连|服务端|减少网络延迟，简化代码架构|Next.js 应用内部使用|

-------
15.React 服务端组件（Server Components）具有以下优势：
+ 原生异步支持：服务端组件直接支持 JavaScript Promise，无需借助 useEffect、useState 或第三方数据请求库，即可使用 async/await 语法：
```typescript
// 直接使用异步操作（无需客户端 Hook）
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```
+ 服务端执行:所有数据获取和复杂逻辑保留在服务端，仅向客户端发送最终结果： 减少客户端计算负担,隐藏敏感逻辑（如数据库查询）
+ 直连数据库,无需额外编写 API 层代码，直接在组件中访问数据库：
```typescript
// 安全示例：服务端直连数据库
export default async function Page() {
  const posts = await prisma.post.findMany(); // 直接操作 ORM
  return <PostList posts={posts} />;
}
```
