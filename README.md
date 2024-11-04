# Malette API Client

Malette API 是一个强大的 AI API 平台，Malette API Client 是它的 Javascript 客户端封装。通过简单的接口调用，让您轻松地与 Malette 服务进行交互。

## ✨ 特性

- 🚀 简单易用的 API 接口
- ⏱️ 支持同步和异步工作流执行
- 🔄 内置超时控制和错误处理
- 🔑 安全的身份验证机制

## 🚀 快速开始

### 安装
```bash
npm install malette-api-client
```

### 基础使用

```javascript
const { Malette } = require('@malette/sdk');
// 初始化客户端
const client = new Malette({
  apiKey: 'your-api-key',
  // endpoint: 'custom-endpoint' // 可选，默认为 https://api.malette.art
});
// 同步执行工作流
async function runWorkflow() {
  try {
    const result = await client.runSync('workflow-code', {
      // 工作流参数
      param1: 'value1',
      param2: 'value2'
    }, 
    {
        timeout: 60 // 可选，超时时间（秒）
    });
    console.log('工作流执行结果:', result);
  } catch (error) {
    console.error('执行出错:', error);
  }
}
```

## 📖 API 文档

### 创建实例

```javascript
const client = new Malette(options)
```


#### 选项

- `apiKey` (必需): 您的 Malette API 密钥
- `endpoint` (可选): API 端点地址，默认为 `https://api.malette.art`

### 方法

#### `run(workflowCode, params, options)`
异步执行工作流，立即返回任务ID。

#### `runSync(workflowCode, params, options)`
同步执行工作流，等待执行完成后返回结果。

#### `getResults(workflowCode, taskId, options)`
获取指定任务的执行结果。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📝 许可证

MIT License

## 💡 支持

如果您在使用过程中遇到任何问题，请通过以下方式获取帮助：

- 提交 GitHub Issue
- 发送邮件至 mark@junemark.tech

---

Made with ❤️ by Malette Team
