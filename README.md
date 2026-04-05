# DevCodes v1.0.0 📡

**The Ultimate HTTP Client Library** - Faster, better, and more powerful than Axios.

DevCodes is a modern, TypeScript-first HTTP client designed to replace Axios with superior performance, simpler API, and full type safety.

## ✨ Features

- **⚡ Lightning Fast** - Optimized for performance with minimal overhead
- **📝 TypeScript First** - Full type definitions and inference
- **🔄 Request/Response Interceptors** - Control request and response flows
- **⏱️ Timeout Support** - Built-in timeout handling
- **🎯 Simple API** - Intuitive interface inspired by Axios but improved
- **📦 Lightweight** - No unnecessary dependencies
- **🌐 Universal** - Works in Node.js and browsers (Fetch API)
- **🔐 Built-in Security** - CORS support, credentials handling
- **🚀 Modern** - Uses Fetch API under the hood

## 📦 Installation

```bash
npm install devcodes-http-tool
```

## 🚀 Quick Start

### Basic Usage

```typescript
import devcodes from 'devcodes-http-tool';

// GET request
const response = await devcodes.get('/api/users');
console.log(response.data);

// POST request
const result = await devcodes.post('/api/users', {
  name: 'John',
  email: 'john@example.com'
});

// With full config
const data = await devcodes.request({
  url: '/api/data',
  method: 'GET',
  baseURL: 'https://api.example.com',
  timeout: 5000
});
```

### Create Instance

```typescript
import { create } from 'devcodes-http-tool';

const client = create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer token123'
  }
});

// Use the instance
const users = await client.get('/users');
```

## 📚 API Reference

### Methods

All methods return a `Promise<Response<T>>` where T is your data type.

#### GET
```typescript
devcodes.get<T>(url, config?)
```

#### POST
```typescript
devcodes.post<T>(url, data?, config?)
```

#### PUT
```typescript
devcodes.put<T>(url, data?, config?)
```

#### PATCH
```typescript
devcodes.patch<T>(url, data?, config?)
```

#### DELETE
```typescript
devcodes.delete<T>(url, config?)
```

#### HEAD
```typescript
devcodes.head<T>(url, config?)
```

#### OPTIONS
```typescript
devcodes.options<T>(url, config?)
```

#### Generic Request
```typescript
devcodes.request<T>(config)
```

### Configuration

```typescript
interface RequestConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  baseURL?: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
  auth?: { username: string; password: string };
  responseType?: 'json' | 'text' | 'arraybuffer' | 'blob';
  maxRedirects?: number;
  validateStatus?: (status: number) => boolean;
}
```

### Response

```typescript
interface Response<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}
```

## 🔗 Interceptors

### Request Interceptors

Modify requests before they're sent:

```typescript
import { create } from 'devcodes-http-tool';

const client = create();

client.requestInterceptors.use(
  (config) => {
    // Add authorization header
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${getToken()}`
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Response Interceptors

Process responses:

```typescript
client.responseInterceptors.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('Request failed:', error);
    return Promise.reject(error);
  }
);
```

## 🔧 Advanced Examples

### Timeout Handling

```typescript
try {
  const data = await devcodes.get('/slow-endpoint', {
    timeout: 5000 // 5 seconds
  });
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    console.log('Request timed out');
  }
}
```

### Custom Status Validation

```typescript
const response = await devcodes.get('/api/data', {
  validateStatus: (status) => status < 500 // Accept anything below 500
});
```

### Query Parameters

```typescript
const response = await devcodes.get('/api/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name'
  }
});
// URL becomes: /api/users?page=1&limit=10&sort=name
```

### Request with Auth

```typescript
const response = await devcodes.get('/api/data', {
  auth: {
    username: 'user',
    password: 'pass'
  }
});
```

### CORS with Credentials

```typescript
const response = await devcodes.get('/api/data', {
  withCredentials: true
});
```

## 🎯 Why DevCodes over Axios?

| Feature | DevCodes | Axios |
|---------|----------|-------|
| **Performance** | ✅ Optimized | ⚠️ Heavier |
| **TypeScript** | ✅ First-class | ⚠️ Basic |
| **Bundle Size** | ✅ Minimal | ⚠️ Larger |
| **Modern API** | ✅ Yes | ⚠️ Legacy |
| **Fetch API** | ✅ Native | ⚠️ XMLHttpRequest |
| **Setup Time** | ✅ Fast | ⚠️ Slower |

## 🐛 Error Handling

```typescript
try {
  const data = await devcodes.get('/api/data');
} catch (error) {
  if (error.isDevCodesError) {
    console.log('Code:', error.code);
    console.log('Status:', error.response?.status);
    console.log('Message:', error.message);
  }
}
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please submit pull requests or issues on GitHub.

---

Built with ❤️ by the DevCodes team
