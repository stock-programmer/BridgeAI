# 后端开发任务 3.1: 实现系统 Prompt 模块

## 任务信息
- **任务ID**: `L2-T1`
- **依赖**: Layer 1 所有任务
- **并行组**: Group-3
- **预估工时**: 20分钟

## 任务目标
实现系统提示词模块,基于 context/system-prompt.md 构建 Prompt 生成逻辑。

## 产出物
`backend/src/prompts/system-prompt.js`

## 核心功能
1. `getSystemPrompt()` - 返回系统角色提示词
2. `buildUserPrompt(role, content)` - 构建用户消息

## 关键代码片段
```javascript
export function getSystemPrompt() {
  return `# Role: 产研协作职能翻译官 (Product-Tech Bridge Translator)

## Profile
你是一位兼具深厚商业洞察力和顶尖系统架构能力的资深技术产品专家...
[完整内容见 backend-architecture.md]
`;
}

export function buildUserPrompt(role, content) {
  const roleLabel = role === 'pm' ? '产品经理' : '开发工程师';
  return `【当前角色】: ${roleLabel}\n\n【输入内容】:\n${content}\n\n【任务】:\n请根据我的角色和输入内容，进行职能翻译。`;
}
```

## 验证
- [ ] 可以导入模块
- [ ] getSystemPrompt() 返回完整提示词
- [ ] buildUserPrompt('pm', 'test') 返回正确格式

---
**创建时间**: 2026-02-09
