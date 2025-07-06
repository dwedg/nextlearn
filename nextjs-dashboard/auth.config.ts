
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  providers:[], // providers 是一个数组，用于列出不同的登录方式（如 Google 或 GitHub 等第三方登录）Credentials用户名密码登录。
  pages: {
    signIn: '/login',
  },
  callbacks:{
    authorized({auth,request:{nextUrl}}){
        const isLoggedIn=!!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
        //如果是直接落地到dashboard页面，需要检查用户是否登录，如果登录过则返回true,说明可以直接登录
        if(isOnDashboard){
            if(isLoggedIn)return true
            return false
        }
        else if(isLoggedIn){
            return Response.redirect(new URL('/dashboard',nextUrl))
        }
        //其他页面可以直接访问。不做权限限制。
        return true;
    }
  }
} satisfies NextAuthConfig;