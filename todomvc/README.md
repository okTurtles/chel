# TodoMVC • Chelonia

A [TodoMVC](http://todomvc.com) implementation using Chelonia identity contracts and direct KV store operations.

This example demonstrates how to build decentralized applications using Chelonia framework based on [Shelter Protocol](https://shelterprotocol.net/).

## 🎯 What You'll Learn

- **Identity Contracts**: How to create and use identity contracts for user management
- **KV Store Operations**: Direct data storage without actions (`todomvc/kv/set`, `todomvc/kv/get`, `todomvc/kv/delete`)
- **Browser Integration**: Using SBP and Chelonia libraries loaded from CDN

## ✨ Key Features

- **🔐 Identity Contracts**: Creates simple identity contracts for user management
- **⚡ Direct KV Store**: Fast TODO operations without action overhead
- **🌐 Browser-First**: CDN-loaded SBP and Chelonia libraries
- **📱 Standard TodoMVC**: Follows official [TodoMVC specification](http://todomvc.com)

## 🏛️ Architecture

### Identity Contract + KV Store Pattern

This TodoMVC follows the [Group Income](https://github.com/okTurtles/group-income) architecture pattern:

1. **Identity Contract**: Creates simple identity contracts for user authentication
2. **KV Store**: TODOs stored directly in the identity contract's KV store
3. **No Actions**: Direct KV operations (`todomvc/kv/set`/`get`/`delete`) instead of actions
4. **Efficient Storage**: No action history for TODOs, just current state

### Data Flow

```
User Login → Identity Contract → KV Store Operations → UI Updates
```

### KV Store Structure

```javascript
// TODOs stored as KV pairs in identity contract
// Key: "todos", Value: Object with all todos
{
  "1755211753157": {
    "id": "1755211753157",
    "text": "Learn Chelonia",
    "completed": false,
    "createdDate": "2025-08-14T22:49:13.157Z"
  }
}
```

## 🔧 Core Operations

- **`todomvc/kv/set`**: Store/update TODOs in browser-compatible way
- **`todomvc/kv/get`**: Retrieve TODOs with localStorage persistence
- **`todomvc/kv/delete`**: Remove TODOs from storage
- **`todomvc/identity/create`**: Create identity contracts for users

## 🚀 Quick Start

### Using Chel Serve (Recommended)

```bash
deno task chel serve todomvc
```

Then open http://localhost:8000/app/

## 📖 How to Use

1. **🔐 Login**: Enter a username (and optional email) to create your identity contract
2. **➕ Add TODOs**: Type in the input field and press Enter
3. **✅ Toggle**: Click the checkbox to mark TODOs as complete/incomplete
4. **✏️ Edit**: Double-click a TODO text to edit it (or press Enter when focused)
5. **🗑️ Delete**: Click the delete button that appears on hover
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

We create simple identity contracts for user management:
- 🔐 **Simple**: Basic user authentication and data scoping
- 🏗️ **Pattern**: Follows Group Income architecture principles
- 📦 **Efficient**: Minimal contract overhead, maximum KV store usage

## 📁 File Structure

```
todomvc/
├── index.html             # Main HTML with CDN imports
├── package.json           # Project configuration  
├── README.md              # This documentation
└── assets/
    ├── css/
    │   └── todomvc.css    # TodoMVC standard styles
    └── js/
        └── app.js         # Main application logic
```

## 🔧 Running the App

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

## 🌐 Browser Integration

### CDN Library Integration ✅

The TodoMVC app integrates SBP and Chelonia libraries directly in the browser:

- **SBP**: `@sbp/sbp@2.4.1` loaded via ESM from jsdelivr CDN
- **Chelonia**: `@chelonia/lib@1.2.2` loaded via ESM from jsdelivr CDN
- **Production Patterns**: Uses SBP selector registration and execution
- **Browser-Compatible Selectors**: Custom `todomvc/*` selectors provide localStorage persistence

### Architecture Benefits

- **🚀 Fast Loading**: Direct CDN imports, no build step required
- **📦 No Dependencies**: Zero npm install, works immediately
- **🔧 Simple Setup**: Just open in browser, libraries load automatically
- **💾 Persistent Storage**: localStorage backing for offline functionality
## 💡 Architecture Decisions

### **Why KV Store Instead of Actions**

- **📈 Performance**: Direct KV operations vs action processing overhead
- **💾 Storage Efficiency**: No action history for simple TODO operations
- **🔧 Simplicity**: Fewer moving parts, easier to understand
- **⚡ Speed**: Faster development and execution

> *"General rule of thumb: unless there is a reason to keep a history, better to store things in the KV store"*
