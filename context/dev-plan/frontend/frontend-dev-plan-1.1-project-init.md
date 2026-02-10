# 前端开发任务 1.1: 项目初始化和配置

## 任务信息
- **任务ID**: `INIT-001`
- **任务层级**: Layer 0 (基础设施层)
- **依赖关系**: 无依赖
- **并行组**: Group-0 (可与其他7个任务并行)
- **预估工时**: 15-20分钟

## 任务目标
初始化 React + Vite 项目，配置 TypeScript、Tailwind CSS 等核心工具。

## 产出物
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.js`
- `.gitignore`
- `README.md`

## 执行步骤

### 1. 创建 Vite 项目
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

### 2. 安装核心依赖
```bash
npm install
npm install tailwindcss@^3.4.0 postcss autoprefixer
npm install zustand@^4.5.0 react-markdown@^9.0.0 remark-gfm@^4.0.0
npm install framer-motion@^11.0.0 react-hot-toast@^2.4.1
```

### 3. 初始化 Tailwind CSS
```bash
npx tailwindcss init -p
```

### 4. 配置 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5. 配置 vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### 6. 配置 tailwind.config.js
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6'
      }
    }
  },
  plugins: []
};
```

## package.json 关键依赖
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "framer-motion": "^11.0.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

## 验证标准
- [ ] `npm run dev` 可以成功启动
- [ ] TypeScript 编译无错误
- [ ] Tailwind CSS 生效
- [ ] 路径别名 @ 可用

---
**创建时间**: 2026-02-09
