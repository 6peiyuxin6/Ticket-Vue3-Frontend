# 登录功能调试指南

## 问题分析

你的Vue登录组件代码逻辑完全正确，问题在于后端API配置。

## 当前状态
- ✅ 前端代码逻辑正确
- ✅ 表单验证正常
- ✅ 错误处理完善
- ❌ 后端API是模拟的，没有真实数据返回

## 解决方案

### 方案1：使用模拟API（当前状态）
当前代码使用模拟API，可以正常测试登录功能：

1. **启动前端开发服务器**：
   ```bash
   npm run dev
   ```

2. **测试登录**：
   - 用户名：`alice`
   - 密码：`password`
   - 点击"Fill Demo"按钮可以自动填充

### 方案2：连接真实后端服务器

#### 步骤1：启动后端服务器
```bash
cd backend
npm install
npm start
```

#### 步骤2：修改前端API配置
在 `src/services/api.ts` 中：
```typescript
const client = axios.create({
  baseURL: 'http://localhost:3002', // 改为你的后端地址
  timeout: 10000
})
```

#### 步骤3：更新登录方法
```typescript
async login(username: string, password: string) {
  try {
    const response = await client.post('/login', { username, password })
    if (response.data.success) {
      return { token: response.data.token, user: response.data.user }
    } else {
      throw new Error(response.data.message || 'Login failed')
    }
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed')
    } else {
      throw new Error('Network error: ' + error.message)
    }
  }
}
```

## 测试步骤

### 1. 测试模拟API
```bash
# 启动前端
npm run dev

# 在浏览器中访问 http://localhost:5173
# 使用用户名: alice, 密码: password
```

### 2. 测试真实后端
```bash
# 启动后端
cd backend && npm start

# 测试API
node test-login.js

# 启动前端
npm run dev
```

## 调试技巧

### 1. 检查网络请求
打开浏览器开发者工具 → Network 标签，查看登录请求：
- 请求URL是否正确
- 请求方法是否为POST
- 请求体是否包含用户名和密码
- 响应状态码和内容

### 2. 检查控制台错误
查看浏览器控制台是否有JavaScript错误：
- 网络错误
- 认证错误
- 路由错误

### 3. 添加调试日志
在登录函数中添加console.log：
```typescript
async function onSubmit() {
  console.log('开始登录，表单数据:', form)
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      console.log('调用login服务...')
      const result = await login(form.username, form.password)
      console.log('登录成功，返回数据:', result)
      ElMessage.success('Logged in')
      router.push('/')
    } catch (err: any) {
      console.error('登录失败:', err)
      ElMessage.error(err.message || 'Login failed')
    } finally {
      loading.value = false
    }
  })
}
```

## 常见问题

### 1. CORS错误
如果看到CORS错误，在后端添加CORS中间件：
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

### 2. 404错误
检查API路径是否正确：
- 前端请求：`/api/login`
- 后端路由：`/login`

### 3. 500错误
检查后端服务器日志，通常是：
- 数据库连接问题
- 代码语法错误
- 依赖包缺失

## 完整的工作流程

1. **开发环境**：使用模拟API快速开发
2. **测试环境**：连接真实后端API
3. **生产环境**：部署到服务器

当前你的代码已经可以正常工作，只需要确保：
- 前端服务器运行在 http://localhost:5173
- 使用正确的用户名和密码（alice/password）
- 检查浏览器控制台是否有错误信息