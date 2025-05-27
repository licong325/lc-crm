/* 从 Node.js URL 模块导入文件 URL 转换相关的工具函数 */
import { fileURLToPath, URL } from 'node:url'
/* 导入 Vite 的核心配置函数和环境变量加载函数 */
import { defineConfig, loadEnv } from 'vite'
/* 导入 Vue 插件，用于处理 .vue 文件 */
import vue from '@vitejs/plugin-vue'
/* 导入 Vue 开发者工具插件，提供更好的开发体验 */
import vueDevTools from 'vite-plugin-vue-devtools'
/* 导入自动导入 API 的插件 */
import AutoImport from 'unplugin-auto-import/vite'
/* 导入自动导入组件的插件 */
import Components from 'unplugin-vue-components/vite'
/* 导入 Element Plus 组件库的解析器 */
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
/* 导入旧浏览器兼容性插件 */
import legacy from '@vitejs/plugin-legacy'
/* 导入文件压缩插件 */
import compression from 'vite-plugin-compression'
import postcsspxtoviewport from 'postcss-px-to-viewport'

// https://vite.dev/config/
/* Vite 配置文件的主体，接收命令和模式参数 */
export default defineConfig(({ command, mode }) => {
  /* 加载环境变量，第三个参数为空字符串表示加载所有环境变量 */
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: './',
    // 插件配置
    plugins: [
      /* 启用 Vue 支持 */
      vue(),
      /* 启用 Vue 开发者工具 */
      vueDevTools(),
      /* 配置 API 自动导入 */
      AutoImport({
        /* 自动导入这些库的 API */
        imports: ['vue', 'vue-router', 'pinia'],
        /* 使用 Element Plus 解析器 */
        resolvers: [ElementPlusResolver()],
        /* 生成类型声明文件的位置 */
        dts: 'src/auto-imports.d.ts',
      }),
      /* 自动导入组件 */
      Components({
        /* 使用 Element Plus 解析器 */
        resolvers: [ElementPlusResolver()],
        /* 生成组件类型声明文件的位置 */
        dts: 'src/components.d.ts',
      }),
      /* 兼容旧浏览器 */
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      /* 生产环境启用 gzip 压缩 */
      compression({
        /* 启用详细日志 */
        verbose: true,
        /* 禁用压缩 */
        disable: false,
        /* 压缩阈值 */
        threshold: 10240,
        /* 压缩算法 */
        algorithm: 'gzip',
        /* 压缩文件扩展名 */
        ext: '.gz',
      }),
    ],

    /* 路径解析配置 */
    resolve: {
      /* 配置路径别名，方便模块导入 */
      alias: {
        /* @ 指向 src 根目录 */
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        /* @assets 指向资源目录 */
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        /* @components 指向组件目录 */
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        /* @views 指向页面视图目录 */
        '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
        /* @store 指向状态管理目录 */
        '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      },
      /* 导入时可以省略的文件扩展名 */
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },

    /* 开发服务器配置 */
    server: {
      /* 服务启动时自动打开浏览器 */
      open: true,
      /* 监听所有网络地址 */
      host: '0.0.0.0',
      /* 开发服务器端口号 */
      port: 8080,
      /* sourcemap 配置 */
      sourcemap: true,
      /* 启用 CORS 跨域支持 */
      cors: true,
      /* API 代理配置 */
      proxy: {
        '/api': {
          /* 代理目标地址 */
          target: env.VITE_API_URL || 'http://localhost:3000',
          /* 允许跨域 */
          changeOrigin: true,
          /* 重写请求路径 */
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    /* 构建配置 */
    build: {
      /* 构建输出目录 */
      outDir: 'dist',
      /* 静态资源输出目录 */
      assetsDir: 'assets',
      /* 小于 4KB 的资源将被转换为 base64 */
      assetsInlineLimit: 4096,
      /* 启用 CSS 代码分割 */
      cssCodeSplit: true,
      /* 生产环境禁用 sourcemap */
      sourcemap: false,
      /* Rollup 打包配置 */
      rollupOptions: {
        output: {
          /* 代码分块输出的文件名格式 */
          chunkFileNames: 'assets/js/[name]-[hash].js',
          /* 入口文件输出格式 */
          entryFileNames: 'assets/js/[name]-[hash].js',
          /* 静态资源输出格式 */
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          /* 手动代码分块策略 */
          manualChunks: {
            /* Vue 相关库打包在一起 */
            vue: ['vue', 'vue-router', 'pinia'],
            /* Element Plus 单独打包 */
            elementPlus: ['element-plus'],
          },
        },
      },
      /* 禁用 brotli 压缩报告 */
      brotliSize: false,
      /* 代码分块大小警告阈值（KB） */
      chunkSizeWarningLimit: 2000,
      /* 禁用 gzip 压缩报告 */
      reportCompressedSize: false,
    },

    /* CSS 相关配置 */
    css: {
      /* 预处理器配置 */
      preprocessorOptions: {
        scss: {
          /* 使用 @use 替代 @import */
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
      /* 开发环境启用 CSS sourcemap */
      devSourcemap: true,
      postcss: {
        plugins: [
          postcsspxtoviewport({
            unitToConvert: 'px',
            viewportWidth: 1920,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/],
            include: undefined,
            landscape: false,
            landscapeUnit: 'vw',
            landscapeWidth: 1920,
          }),
        ],
      },
    },

    /* 依赖优化配置 */
    optimizeDeps: {
      /* 预构建的依赖项 */
      include: ['vue', 'vue-router', 'pinia', 'axios'],
    },
  }
})
