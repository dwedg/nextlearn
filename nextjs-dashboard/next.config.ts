import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    ppr:'incremental'//incremental允许ppr作用于特定的路由
  }
};

export default nextConfig;
