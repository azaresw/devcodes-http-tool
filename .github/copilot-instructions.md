## DevCodes v1.0.0 - Project Overview

**Ultimate HTTP Client Library** - A faster, better Axios alternative with full TypeScript support.

### Project Structure

```
devcodes/
├── src/
│   ├── index.ts           # Main entry point & default exports
│   ├── client.ts          # DevCodesClient implementation
│   ├── types.ts           # TypeScript type definitions
│   ├── interceptors.ts    # Interceptor manager implementation
│   └── utils.ts           # Utility functions
├── dist/                  # Compiled JavaScript & types (auto-generated)
├── package.json           # Project configuration & dependencies
├── tsconfig.json          # TypeScript configuration
├── README.md              # Comprehensive documentation
└── .gitignore             # Git ignore rules
```

### Key Features

- **TypeScript First**: Full type safety with complete type definitions
- **Fast & Lightweight**: Built on Fetch API with minimal overhead
- **Request/Response Interceptors**: Easy to use interceptor system
- **Full Axios Compatibility**: Drop-in replacement for most use cases
- **Browser & Node.js**: Works everywhere with Fetch API support

### Development Commands

```bash
npm run build          # Compile TypeScript to JavaScript
npm run dev           # Watch mode - recompile on changes
npm test              # (placeholder for future tests)
npm run prepublishOnly # Pre-publish hook
```

### Build Output

- **Main Entry**: `dist/index.js` - CommonJS
- **ES Module**: `dist/index.esm.js` - ES Module (defined in package.json)
- **Types**: `dist/*.d.ts` - TypeScript declarations
- **Source Maps**: `dist/*.js.map` - Debugging support

### API Architecture

#### Core Classes
- `DevCodesClient`: Main HTTP client class with all request methods
- `InterceptorManagerImpl`: Request/response interceptor management

#### Public API
- **Methods**: `get()`, `post()`, `put()`, `patch()`, `delete()`, `head()`, `options()`, `request()`
- **Instance Creation**: `create(config)` - create custom client instances
- **Default Instance**: Default exports for quick usage

#### Configuration
- `RequestConfig`: Request configuration interface
- `Response<T>`: Type-safe response interface
- `DevCodesError`: Custom error type with full context

### Common Tasks

#### Adding a New HTTP Method
1. Add to `RequestConfig.method` type in `types.ts`
2. Implement method in `DevCodesClient` class in `client.ts`
3. Add binding in default exports in `index.ts`

#### Modifying Interceptors
- Edit `InterceptorManagerImpl` in `interceptors.ts`
- Update usage in `DevCodesClient.request()` method
- Test with request/response interception scenarios

#### Performance Optimization
- Keep dependencies minimal (currently only TypeScript dev dep)
- Avoid unnecessary object allocations in hot paths (request/response processing)
- Use Fetch API native capabilities directly
- Profile with browser DevTools for client-side usage

### Configuration Notes

- **Target**: ES2020 for modern browsers and Node.js 14+
- **Module Resolution**: CommonJS with ESM export support
- **Strict Mode**: Enabled for maximum type safety
- **Source Maps**: Enabled for debugging production builds

### Error Handling

All errors use the custom `DevCodesError` type with:
- `isDevCodesError` flag for type checking
- `code` property for error categorization
- Full request/response context
- Standard Error name: "DevCodesError"

### Publishing

Package is ready for npm publishing:
```bash
npm version patch|minor|major
npm publish
```

Pre-publish automatically runs the build to ensure `dist/` is up to date.

### Dependencies

**Dev Dependencies**:
- `typescript@^5.3.3` - TypeScript compiler

**Runtime Dependencies**: None (uses native Fetch API)

**Peer Requirements**:
- Node.js 14.0.0+
- Browser with Fetch API support

---

**Status**: ✅ Project initialized and ready for use/publication
**Version**: 1.0.0
**License**: MIT
