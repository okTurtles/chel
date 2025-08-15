# TodoMVC • Chelonia

A [TodoMVC](http://todomvc.com) implementation using Chelonia identity contracts and direct KV store operations.

This example demonstrates how to build decentralized applications using Chelonia framework based on [Shelter Protocol](https://shelterprotocol.net/).

## 🎯 What You'll Learn

- **Identity Contracts**: How to use existing `gi.contracts/identity` contracts
- **KV Store Operations**: Direct data storage without actions (`chelonia/kv/set`, `chelonia/kv/get`, `chelonia/kv/delete`)
- **Decentralized Architecture**: Building apps without centralized servers

## ✨ Key Features

- **🔐 Uses Identity Contracts**: Leverages existing `gi.contracts/identity` (no new contract creation)
- **⚡ Direct KV Store**: Fast TODO operations without action overhead
- **🚫 No Service Worker**: Simple browser-based implementation
- **📱 Standard TodoMVC**: Follows official [TodoMVC specification](http://todomvc.com)

## 🏛️ Architecture

### Identity Contract + KV Store Pattern

This TodoMVC follows the [Group Income](https://github.com/okTurtles/group-income) architecture where:

1. **Identity Contract**: Uses existing `gi.contracts/identity` for user management
2. **KV Store**: TODOs stored directly in the identity contract's KV store
3. **No Actions**: Direct KV operations (`set`/`get`/`delete`) instead of actions
4. **Efficient Storage**: No action history for TODOs, just current state

### Data Flow

```
User Login → Identity Contract → KV Store Operations → UI Updates
```

### KV Store Structure

```javascript
// TODOs stored as KV pairs in identity contract
"todo:1755211753157" → {
  "id": "1755211753157",
  "text": "Learn Chelonia",
  "completed": false,
  "createdDate": "2025-08-14T22:49:13.157Z"
}
```

## 🔧 Core Operations

- **`chelonia/kv/set`**: Store/update TODOs
- **`chelonia/kv/get`**: Retrieve specific TODO
- **`chelonia/kv/delete`**: Remove TODO
- **Direct KV Access**: No actions needed!

## 🚀 Quick Start

### Using Chel Serve (Recommended)

```bash
deno task chel serve todomvc
```

Then open http://localhost:8000/app/

## 📖 How to Use

1. **🔐 Login**: Enter a username (and optional email) to use your identity contract
2. **➕ Add TODOs**: Type in the input field and press Enter
3. **✅ Toggle**: Click the checkbox to mark TODOs as complete/incomplete
4. **✏️ Edit**: Double-click a TODO text to edit it
5. **🗑️ Delete**: Hover over a TODO and click the × button
6. **🔍 Filter**: Use All/Active/Completed filters
7. **⚡ Bulk Actions**: Use "Mark all as complete" or "Clear completed"

## 🎓 Learning Resources

### New to Chelonia?
- **[Shelter Protocol](https://shelterprotocol.net/)** - The underlying protocol
- **[Group Income](https://groupincome.org/)** - Real-world Chelonia app

### Understanding the Code
- **[Group Income Repository](https://github.com/okTurtles/group-income)** - See full implementation
- **[SBP (Simple Behavior Protocol)](https://github.com/okTurtles/sbp)** - The foundation
- **[Chelonia Library](https://github.com/okTurtles/libcheloniajs)** - Chelonia Core Library

## 💡 Why This Architecture?

### KV Store vs Actions

As noted by the Group Income:

> **"General rule of thumb: unless there is a reason to keep a history, better to store things in the KV store"**

TODOs don't need action history, so we use direct KV operations for:
- ⚡ **Performance**: No action overhead
- 💾 **Storage**: No unnecessary history
- 🔧 **Simplicity**: Direct get/set/delete operations

### Identity Contracts

Instead of creating new contracts, we use existing `gi.contracts/identity`:
- 🔐 **Reusable**: One identity per user across apps
- 🏗️ **Proven**: Battle-tested in Group Income
- 📦 **Efficient**: No contract creation overhead

## 📁 File Structure

```
todomvc/
├── index.html             # Main HTML file
├── package.json           # Project configuration  
├── README.md              # This documentation
├── assets/
│   ├── css/
│   │   └── todomvc.css    # TodoMVC standard styles
│   └── js/
│       └── app.js         # Main application logic
└── contracts/
    └── todomvc.manifest.json  # Contract manifest (placeholder)
```

## 🔧 Integration with Chel CLI

This example works seamlessly with the Chel CLI:

### Quick Start

```bash
# Start the TodoMVC app (recommended)
npm start

# Or run directly
deno task chel serve todomvc
```

### Alternative Serving

```bash
# Simple Python server (for development)
npm run serve
```

**Note**: Since this TodoMVC uses identity contracts and direct KV operations, no custom contract pinning or manifest generation is needed. The `chel serve` command handles everything automatically!

## 🔀 Alternative Architecture: Custom Contracts + Actions

If you wanted to implement TodoMVC with **custom contracts and actions** instead of identity contracts + KV store, you would need:

### **Dependencies**
```json
{
  "dependencies": {
    "@sbp/sbp": "^0.15.0"
  }
}
```

### **Contract Development Workflow**
```bash
# 1. Create custom gi.contracts/todomvc contract with actions
# 2. Generate cryptographic keys
chel keygen

# 3. Pin contract to specific version
chel pin 1.0.0 contracts/todomvc.js

# 4. Generate production manifest
chel manifest --slim contracts/todomvc-slim.js --version 1.0.0 --out contracts/todomvc.manifest.json key.json contracts/todomvc.js

# 5. Deploy with contract preloading
chel serve todomvc
```

### **Why We Chose KV Store Instead**
- **📈 Performance**: Direct KV operations vs action processing overhead
- **💾 Storage Efficiency**: No action history for simple TODO operations
- **🔧 Simplicity**: Fewer moving parts, easier to understand
- **⚡ Speed**: Faster development and execution

> *"General rule of thumb: unless there is a reason to keep a history, better to store things in the KV store"*
