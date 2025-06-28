//从 Google Fonts 引入的 Inter 字体家族（一个流行的无衬线字体）。
import {Inter,Lusitana} from 'next/font/google';
//创建字体配置实例的方法调用。并制定加载拉丁字符集
export const inter = Inter({subsets:['latin']})
export const lusitana = Lusitana({
    subsets:['latin'],
    weight:['400','700']
})