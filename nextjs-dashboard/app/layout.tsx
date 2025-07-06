import '@/app/ui/global.css'
import {inter} from '@/app/ui/fonts'
import { Metadata } from 'next';
//在根布局文件中加了一个模版配置，模板中的 %s 会被替换为具体页面的标题。在/dashboard/invoices 页面中，你可以添加该页面的标题会被替换为：‘Invoices | Acme Dashboard’
export const metadata:Metadata={
  title:{
    template:`%s|Acme Dashboard`,
    default:'Acme Dashboard'
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
