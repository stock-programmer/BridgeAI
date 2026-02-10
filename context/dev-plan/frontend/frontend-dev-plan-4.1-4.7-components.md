# 前端开发任务 4.1-4.7: 组件层实现

## 任务信息
- **Layer**: Layer 3 (组件层)
- **并行组**: Group-3 (7个任务可并行)
- **总预估工时**: 120分钟

## 任务列表

### Task 4.1: Button 组件 (COMP-COMMON-001)
**文件**: `src/components/common/Button/Button.tsx`
**Props**: variant, size, loading, disabled

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children
}) => {
  const baseClasses = 'rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

### Task 4.2: TextArea 组件 (COMP-COMMON-002)
**文件**: `src/components/common/TextArea/TextArea.tsx`
**功能**: 多行输入、自动高度、字符计数

### Task 4.3: RoleSelector 组件 (COMP-COMMON-003)
**文件**: `src/components/common/RoleSelector/RoleSelector.tsx`
**功能**: PM/Dev角色切换

### Task 4.4: Header 组件 (COMP-LAYOUT-001)
**文件**: `src/components/layout/Header/Header.tsx`
**内容**: Logo、标题、WebSocket状态

### Task 4.5: Footer 组件 (COMP-LAYOUT-002)
**文件**: `src/components/layout/Footer/Footer.tsx`
**内容**: 版权信息、链接

### Task 4.6: StreamingText 组件 (COMP-BUSINESS-001)
**文件**: `src/components/translation/StreamingText/StreamingText.tsx`
**功能**: Markdown渲染、打字机效果

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

export const StreamingText: React.FC<{
  content: string;
  isStreaming: boolean;
}> = ({ content, isStreaming }) => {
  return (
    <div className="streaming-container">
      <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <motion.span
          className="cursor"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ▊
        </motion.span>
      )}
    </div>
  );
};
```

### Task 4.7: InputPanel 组件 (COMP-BUSINESS-002)
**文件**: `src/components/translation/InputPanel/InputPanel.tsx`
**功能**: 组合 RoleSelector + TextArea + Button

## 验证标准
- [ ] 所有组件可以独立渲染
- [ ] 组件交互正常
- [ ] 样式符合设计要求

---
**创建时间**: 2026-02-09
