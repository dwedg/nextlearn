1.Suspense组件的key的属性值可以作为一个强制刷新机制：当key改变时，React会重新加载Suspense中的组件，并重新触发fallback和异步逻辑。它是控制 Suspense 行为的一个重要技巧，特别适用于需要根据参数变化重新加载的场景。比如根据搜索内容的不同，展示不同的搜索结果。

```typescript
<Suspense fallback={<Loading />} key={searchQuery}>
  <SearchResults query={searchQuery} />
</Suspense>
```
每次searchQuery改变的时候，Suspense的key也改变，React 会卸载原有的 Suspense + SearchResults 组件树；重新加载 SearchResults，并再次显示 fallback；这可以避免 React “复用旧组件”的优化行为，从而确保异步加载被重新触发。

------
2.Server Action可以直接在服务器上运行异步代码。无需单独创建API接口来修改数据。可以编写一些在服务端执行的异步函数，这些函数可以在客户端或者服务器组件里被调用。
✅Server Action包含了一些关键的安全特性，比如加密闭包，严密的输入校验，错误信息哈希处理，主机访问限制

✅在服务端组件（Server Component）中调用 Server Action 的一个优势是渐进增强（progressive enhancement） —— 即使客户端的 JavaScript 还没有加载，表单依然可以正常工作。
+ 渐进增强的意思就是表单的核心功能比兔提交，导航在没有javascript的情况也能运行、然后在js可用时再增强交互体验（如即时验证，动态刷新）
+ react应用依赖大量的js来处理交互，比如表单提交，但有时用户的网络非常慢；浏览器尚未加载完js资源；用户禁用了javascript;在这种情况下，客户端的js无法运行，表单可能无法提交。

----
3.在 Server Component 中使用 `<form action={serverAction}>`：这个表单是 HTML 原生表单,action 是指向一个 服务端函数（Server Action）；当用户点击“提交”时，浏览器会发起原生的 POST 请求，数据会发送到服务器，执行该 Server Action；即使没有加载任何 JavaScript，表单仍然能提交，页面仍然能响应用户操作。
```tsx
<form action={saveUserData}>
    <input name='email' />
    <button type='submit'>提交<button/>
</form>
```
+ 即使客户端的js没有加载，点击提交后，浏览器也能正常提交表单数据到服务器
+ 服务端的saveUserData函数会处理这个请求
+ 最终页面会响应或跳转，完全依赖html和服务器，无需js

------
4。当通过 Server Action 提交表单时，你不仅可以在该 action 中修改数据，还可以使用 revalidatePath 和 revalidateTag 等 API 来重新验证（刷新）相关的缓存内容。

----
5. 通过添加 'use server'，你可以将该文件中所有导出的函数标记为 Server Actions（服务端操作）。这些服务端函数随后可以被 客户端组件（Client Components） 和 服务端组件（Server Components） 引入和使用。在最终的应用构建中，未被使用的函数会自动从产物中移除，不会被打包。也可以在服务端组件中，直接在函数内部添加 "use server" 来编写 Server Action。

-----
6.在html中，会把一个URL传递给form的action属性，这个URL就是表单数据要提交到的目标地址（通常是一个 API 接口）。但在react中，action被视为一个特殊属性，react在其基础上进行了扩展，可以直接调用server actions.在幕后，Server Actions 会自动创建一个 POST 类型的 API 接口。这也是为什么当你使用 Server Actions 时，不需要手动创建 API 接口的原因。

-----

7.nextjs拥有一个客户端路由缓存，它会在用户的浏览器中暂时存储路由片段,结合prefetching功能，这个缓存可以确保用户在页面之间快速导航，同时减少向服务器发送请求的次数。

-----
8.revalidatePath是Nextjs提供的一个Server Actions和路由缓存机制中的函数，用在服务器端清除某个路径的缓存并强制重新请求。
+ 作用：使指定的页面路径失效，强制刷新缓存，从而触发服务端重新生成页面内容。
+ 场景：在服务端执行了某些操作（如新增、修改、删除数据库中的数据），你可能希望相关页面能立即反映最新的数据，而不是继续使用旧缓存。这时就可以调用：
```ts
revalidatePath('/invoices');
//下一次访问 /invoices 时，Next.js 会跳过客户端缓存，发起新的请求并重新渲染页面。
```
------
9.nextjs可以在无法预先确定路由名称，但是希望根据数据动态生成路由的情况下，创建动态路由。比如博客文章详情页，商品页面。

创建动态路由段的方法：通过将文件夹名称用中括号包裹的方式来创建动态路由段：比如[id],[post],[slug]这些动态段会在页面访问时从 URL 中提取对应的值。

------
10.nextjs的redirect是在try/catch块之外调用的，因为redirect的实现方式是通过抛出一个异常来完成跳转，如果把redirect放在try语句块内，它会被catch捕获，从而阻止跳转。

-----
11.error.tsx必须声明为客户端组件，'use client',因为需要使用浏览器API和交互功能（如错误重置操作）。
+ error:标准的js Error对象实例，包含错误信息（error.message）和错误堆栈（error.stack）
+ reset:错误边界重置函数，执行时会尝试重新渲染该路由片段，相当于给用户一个"重试"的机会

-----
12.通过在目录文件下创建一个not-found.tsx文件，在相应的逻辑处调用navigation模块中的notFound函数来处理资源缺失的情况。

----
13.在 Next.js 的错误处理体系中，notFound() 的优先级确实高于 error.tsx，这种设计让错误处理可以分层级精准控制

-----
14.Next.js 在其 ESLint 配置中内置了 eslint-plugin-jsx-a11y 插件，用于帮助你提前发现潜在的无障碍性问题.例如，如果你在页面中：使用了没有 alt 文本的图片，错误使用了 aria-* 或 role 属性，这个插件就会发出警告，提醒进行修复。

-----
15.nextjs表单所所做的无障碍性
+ ✅ 语义化 HTML使用语义化元素（如 `<input>`、`<option>` 等）而不是 `<div>`。这使得辅助技术（Assistive Technologies，简称 AT）能够专注于输入元素，并向用户提供正确的上下文信息，从而让表单更易于理解和操作。
+ ✅ 标签关联（Labelling）,使用 `<label> `标签并配合 htmlFor 属性，确保每个表单字段都有一个描述性的文本标签。这不仅提升了辅助技术的支持，也增强了用户体验 —— 用户点击标签时会自动聚焦对应的输入框。
+ ✅ 焦点样式（Focus Outline）,当表单字段处于聚焦状态时，会显示清晰的轮廓样式（outline）。这是无障碍设计中的关键因素，能明确告诉用户当前页面上的活动元素，有助于键盘操作用户和使用屏幕阅读器的用户判断焦点位置.

----
16。服务端的表单验证可以实现：
+ 确保数据在写入数据库之前符合预期的格式
+ 降低恶意用户绕过客户端验证的风险
+ 统一数据验证标准，即由服务端作为唯一可信的数据验证来源

-----
17.useActionState是React（特别是在 Next.js App Router + Server Actions 中）提供的一个专门用于处理表单状态和服务器响应的hook,可以以一种声明的方式在客户端组件中使用Server Action，并同时追踪状态（如提交结果，错误信息等）
```js
const [state,formAction]=useActionState(myServerAction,initialState)
```
+ myServerAction，一个服务端函数，通常使用use server标记的函数
+ initialSate,表单初始状态，可以是null,对象，字符创，error对象等
+ state,myServerAction执行后的结果（比如表单处理结果，验证错误等）
+ formAction,绑定到form的action属性值，用于触发ServerAction

----
18.身份验证，用来确认用户身份的过程，通过提供用户名和密码登信息来证明我是谁。授权（Authorization） 是在用户身份被确认之后的下一步。它决定该用户可以使用应用程序中的哪些部分、访问哪些资源。身份验证 是“你是谁”；授权 是“你可以做什么”或“你可以访问什么”。

------
19.NextAuth.js 抽象掉了处理会话、登录与登出以及其他身份验证相关操作中大部分的复杂性。NextAuth.js 简化了这一流程，为 Next.js 应用 提供了一个统一的身份验证解决方案。

-----
20.nextjs的pages选项来指定自定义的登录，登出，和错误页面的路由路径。虽然这不是必须配置的选项，但通过在 pages 选项中添加 signIn: '/login'，用户将被重定向到自定义的登录页面，而不是 NextAuth.js 的默认页面。

-----
21.nextjs的callbaks是一些回调函数，authorzed回调函数用于在Nextjs的Middleware中验证某个请求是否具有权限访问页面。它会在请求完成之前被调用，并接收一个包含 auth 和 request 属性的对象：
+ auth 属性包含用户的会话信息（session）；
+ request 属性是当前的传入请求对象。


----
22. Middleware 的 matcher 选项，指定中间件只在特定路径上运行。受保护的路由在身份验证被中间件验证之前，根本不会开始渲染，

-----
23.再将用户的密码存入数据库之前需要进行哈希梳理，哈希会将密码转换为一个固定长度的随机字符字符串，即使用户数据被泄露，也能提供一层安全保护。

-----
24. 元数据：在 Web 开发中，元数据是用来提供网页额外信息的数据。元数据对访问网页的用户是不可见的，它在页面后台运行，通常嵌入在页面 HTML 的 `<head>` 元素中。这些隐藏的信息对于搜索引擎和其他需要理解你网页内容的系统来说至关重要。
+ 添加元数据的方法

✅基于配置的方式（Config-based）：可以在 layout.js 或 page.js 文件中导出一个静态的 metadata 对象，或一个动态的 generateMetadata 函数，用于定义当前页面或布局的元数据

✅基于文件的方式（File-based）:Next.js 支持一系列专用于元数据的特殊文件:
```text
🔍favicon.ico、apple-icon.jpg、icon.jpg：用于网页图标（favicon 和应用图标）；
🔍opengraph-image.jpg、twitter-image.jpg：用于社交媒体分享时的展示图片；
🔍robots.txt：为搜索引擎提供抓取网页的指令；
🔍sitemap.xml：提供网站结构信息，帮助搜索引擎更好地索引内容。
可以将这些文件作为静态元数据使用，也可以在项目中以编程方式动态生成它们。
```
不论使用哪种方式，Next.js 都会自动为页面生成相应的 <head> 元素。

------
25.嵌套路由中的页面所设置的元数据会覆盖其父级页面中的元数据。