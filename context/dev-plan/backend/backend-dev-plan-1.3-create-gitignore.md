# 后端开发任务 1.3: 创建 .gitignore

## 任务信息
- **任务ID**: `L0-T3`
- **任务层级**: Layer 0 (第一层 - 基础设施层)
- **依赖关系**: 无依赖 (可立即开始)
- **并行组**: Group-1 (可与 1.1, 1.2, 1.4 并行执行)
- **预估工时**: 5分钟

## 任务目标
创建 .gitignore 文件,防止敏感信息和无需版本控制的文件被提交到 Git 仓库。

## 产出物
- **文件路径**: `backend/.gitignore`
- **文件类型**: Git配置文件

## 需要忽略的内容类别

### 1. 依赖目录
```
node_modules/
```
**原因**: npm 安装的依赖包体积大,可通过 package.json 恢复

### 2. 日志文件
```
logs/
*.log
npm-debug.log*
```
**原因**: 日志文件仅在本地有意义,不应提交

### 3. 环境配置
```
.env
.env.local
.env.*.local
```
**原因**: 包含敏感信息 (API Key、数据库密码等)

### 4. 系统文件
```
.DS_Store
Thumbs.db
```
**原因**: 操作系统生成的元数据文件

### 5. 编辑器配置
```
.vscode/
.idea/
*.swp
*.swo
```
**原因**: 开发者个人编辑器配置,不应强制他人使用

### 6. 构建产物
```
dist/
build/
coverage/
```
**原因**: 可通过构建命令生成,不需要提交

### 7. 临时文件
```
*.tmp
*.temp
.cache/
```

## 完整文件内容

```gitignore
# 依赖目录
node_modules/

# 日志文件
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境配置 (包含敏感信息)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 系统文件
.DS_Store
Thumbs.db
*.swp
*.swo

# 编辑器配置
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# 测试覆盖率报告
coverage/
.nyc_output/

# 构建产物
dist/
build/

# 临时文件
*.tmp
*.temp
.cache/

# PM2 日志 (如果使用 PM2)
pm2-*.log

# 备份文件
*.bak
*.backup
```

## 执行步骤

### 1. 进入后端目录
```bash
cd backend/
```

### 2. 创建 .gitignore 文件
```bash
cat > .gitignore << 'EOF'
# 依赖目录
node_modules/

# 日志文件
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 环境配置 (包含敏感信息)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 系统文件
.DS_Store
Thumbs.db
*.swp
*.swo

# 编辑器配置
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# 测试覆盖率报告
coverage/
.nyc_output/

# 构建产物
dist/
build/

# 临时文件
*.tmp
*.temp
.cache/

# PM2 日志
pm2-*.log

# 备份文件
*.bak
*.backup
EOF
```

### 3. 验证文件
```bash
cat .gitignore
```

### 4. 测试忽略规则 (可选)
```bash
# 创建一个测试文件
touch test.log

# 查看 Git 状态 (test.log 应该不会显示)
git status
```

## 验证标准
- [ ] .gitignore 文件存在于 backend/ 目录
- [ ] 文件包含 node_modules/ 规则
- [ ] 文件包含 .env 规则
- [ ] 文件包含 logs/ 规则
- [ ] 文件包含 *.log 规则
- [ ] 使用 `cat .gitignore` 能正确显示内容
- [ ] 创建的测试日志文件不会出现在 `git status` 中

## 安全注意事项

### ⚠️ 重要提醒
1. **务必在第一次提交前创建**: 避免误提交敏感信息
2. **优先级**: .gitignore 中的规则按从上到下的顺序匹配
3. **已提交文件**: 如果某文件已被 Git 追踪,添加到 .gitignore 不会自动移除,需要手动操作:
   ```bash
   git rm --cached <filename>
   ```

### 🔒 敏感信息防护
- `.env` 文件必须忽略
- 如果已误提交,需要:
  1. 从历史记录中删除
  2. 轮换 (rotate) 所有泄露的密钥/密码

## 后续任务依赖
该任务与 `L0-T4` (创建 .env.example) 配合使用:
- .gitignore 忽略 .env
- .env.example 提交到 Git,作为环境变量模板

## 最佳实践
```bash
# 在项目初始化时,应该按以下顺序操作:
1. git init
2. 创建 .gitignore (本任务)
3. 创建 .env.example (任务 1.4)
4. git add .gitignore .env.example
5. git commit -m "chore: 初始化项目配置"
```

## 状态追踪
- [x] 任务规划完成
- [ ] 任务执行中
- [ ] 任务已完成
- [ ] 已验证

---
**创建时间**: 2026-02-09
**所属文档**: backend-development-plan.md
**DAG位置**: Layer 0 → 第3个并行任务
