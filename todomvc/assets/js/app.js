// TodoMVC App using Chelonia (no service worker)
// Based on pre-SW Group Income architecture

const sbp = (function() {
  const selectors = {}
  
  function sbp(selector, ...args) {
    if (selectors[selector]) {
      return selectors[selector](...args)
    }
    throw new Error(`Unknown selector: ${selector}`)
  }
  
  sbp.selectors = {
    register: (selectorMap) => {
      Object.assign(selectors, selectorMap)
    }
  }
  
  return sbp
})()

// Simplified storage for demo (in real app this would be Chelonia contracts)
const demoStorage = {
  contracts: {},
  kvStore: {}
}

class TodoMVCApp {
  constructor() {
    this.contractID = null
    this.currentFilter = 'all'
    this.todos = {}
    
    this.initializeElements()
    this.bindEvents()
    this.setupRouting()
  }

  initializeElements() {
    this.loginModal = document.getElementById('login-modal')
    this.loginForm = document.getElementById('login-form')
    this.usernameInput = document.getElementById('username')
    this.emailInput = document.getElementById('email')
    
    this.newTodoInput = document.querySelector('.new-todo')
    this.todoList = document.querySelector('.todo-list')
    this.toggleAllCheckbox = document.getElementById('toggle-all')
    this.mainSection = document.querySelector('.main')
    this.footerSection = document.querySelector('.footer')
    this.todoCount = document.querySelector('.todo-count')
    this.clearCompletedBtn = document.querySelector('.clear-completed')
    this.filterLinks = document.querySelectorAll('.filters a')
  }

  bindEvents() {
    // Login form
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e))
    
    // New todo
    this.newTodoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        this.addTodo(e.target.value.trim())
        e.target.value = ''
      }
    })
    
    // Toggle all
    this.toggleAllCheckbox.addEventListener('change', (e) => {
      this.toggleAll(e.target.checked)
    })
    
    // Clear completed
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted())
    
    // Filter links
    this.filterLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        this.setFilter(link.getAttribute('href').slice(2) || 'all')
      })
    })
  }

  setupRouting() {
    window.addEventListener('hashchange', () => {
      const filter = window.location.hash.slice(2) || 'all'
      this.setFilter(filter)
    })
    
    // Set initial filter
    const filter = window.location.hash.slice(2) || 'all'
    this.setFilter(filter)
  }

  async handleLogin(e) {
    e.preventDefault()
    
    const username = this.usernameInput.value.trim()
    const email = this.emailInput.value.trim()
    
    if (!username) return
    
    try {
      // Use existing identity contract (simulate finding existing contract by username)
      // In real Group Income, this would look up an existing identity contract
      this.contractID = `identity_${username}_${Date.now()}`
      
      console.log('Using identity contract:', this.contractID)
      
      // Initialize identity data in demo storage (simulate existing contract)
      demoStorage.contracts[this.contractID] = {
        name: 'gi.contracts/identity',
        data: {
          username,
          email: email || null
        },
        createdAt: new Date().toISOString()
      }
      
      // Initialize KV store for this identity contract
      demoStorage.kvStore[this.contractID] = {}
      
      // Hide login modal
      this.loginModal.style.display = 'none'
      
      // Load initial todos from KV store
      await this.loadTodos()
      this.render()
      
    } catch (error) {
      console.error('Failed to use identity contract:', error)
      alert('Failed to start TodoMVC. Please try again.')
    }
  }

  async loadTodos() {
    if (!this.contractID) return
    
    try {
      // Load todos directly from KV store (Group Income architecture)
      this.todos = {}
      const kvData = demoStorage.kvStore[this.contractID] || {}
      
      for (const [key, value] of Object.entries(kvData)) {
        if (key.startsWith('todo:')) {
          const todoId = key.replace('todo:', '')
          try {
            this.todos[todoId] = JSON.parse(value)
          } catch (e) {
            console.warn('Failed to parse todo:', key, e)
          }
        }
      }
      
      console.log('Loaded todos from KV store:', Object.keys(this.todos).length)
    } catch (error) {
      console.error('Failed to load todos:', error)
      this.todos = {}
    }
  }

  async addTodo(text) {
    if (!this.contractID) return
    
    const id = Date.now().toString()
    const todo = {
      id,
      text,
      completed: false,
      createdDate: new Date().toISOString()
    }
    
    try {
      // Store directly in KV store instead of using actions
      await sbp('chelonia/kv/set', this.contractID, `todo:${id}`, JSON.stringify(todo))
      
      // Update local state
      this.todos[id] = todo
      
      this.render()
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  async updateTodo(id, updates) {
    if (!this.contractID) return
    
    try {
      // Get existing todo from KV store
      const existingTodoJson = await sbp('chelonia/kv/get', this.contractID, `todo:${id}`)
      if (existingTodoJson) {
        const existingTodo = JSON.parse(existingTodoJson)
        const updatedTodo = {
          ...existingTodo,
          ...updates,
          updatedDate: new Date().toISOString()
        }
        
        // Store updated todo directly in KV store
        await sbp('chelonia/kv/set', this.contractID, `todo:${id}`, JSON.stringify(updatedTodo))
        
        // Update local state
        this.todos[id] = updatedTodo
      }
      
      this.render()
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  async deleteTodo(id) {
    if (!this.contractID) return
    
    try {
      // Delete directly from KV store
      await sbp('chelonia/kv/delete', this.contractID, `todo:${id}`)
      
      // Update local state
      delete this.todos[id]
      
      this.render()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  async toggleAll(completed) {
    if (!this.contractID) return
    
    try {
      // Update all todos directly in KV store
      for (const [id, todo] of Object.entries(this.todos)) {
        const updatedTodo = { ...todo, completed, updatedDate: new Date().toISOString() }
        await sbp('chelonia/kv/set', this.contractID, `todo:${id}`, JSON.stringify(updatedTodo))
        this.todos[id] = updatedTodo
      }
      
      this.render()
    } catch (error) {
      console.error('Failed to toggle all todos:', error)
    }
  }

  async clearCompleted() {
    if (!this.contractID) return
    
    try {
      // Delete completed todos directly from KV store
      const completedIds = Object.keys(this.todos).filter(id => this.todos[id].completed)
      
      for (const id of completedIds) {
        await sbp('chelonia/kv/delete', this.contractID, `todo:${id}`)
        delete this.todos[id]
      }
      
      this.render()
    } catch (error) {
      console.error('Failed to clear completed todos:', error)
    }
  }

  setFilter(filter) {
    this.currentFilter = filter
    
    // Update filter links
    this.filterLinks.forEach(link => {
      link.classList.remove('selected')
      if (link.getAttribute('href') === `#/${filter}` || (filter === 'all' && link.getAttribute('href') === '#/')) {
        link.classList.add('selected')
      }
    })
    
    this.render()
  }

  getFilteredTodos() {
    const todos = Object.values(this.todos)
    
    switch (this.currentFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }

  render() {
    const todos = Object.values(this.todos)
    const filteredTodos = this.getFilteredTodos()
    const activeTodos = todos.filter(todo => !todo.completed)
    const completedTodos = todos.filter(todo => todo.completed)
    
    // Show/hide main and footer sections
    const hasTodos = todos.length > 0
    this.mainSection.style.display = hasTodos ? 'block' : 'none'
    this.footerSection.style.display = hasTodos ? 'block' : 'none'
    
    // Update toggle all checkbox
    this.toggleAllCheckbox.checked = activeTodos.length === 0 && todos.length > 0
    
    // Render todo list
    this.todoList.innerHTML = filteredTodos.map(todo => this.renderTodoItem(todo)).join('')
    
    // Update todo count
    const activeCount = activeTodos.length
    const itemText = activeCount === 1 ? 'item' : 'items'
    this.todoCount.innerHTML = `<strong>${activeCount}</strong> ${itemText} left`
    
    // Show/hide clear completed button
    this.clearCompletedBtn.style.display = completedTodos.length > 0 ? 'block' : 'none'
    
    // Bind todo item events
    this.bindTodoEvents()
  }

  renderTodoItem(todo) {
    return `
      <li data-id="${todo.id}" class="${todo.completed ? 'completed' : ''}">
        <div class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
          <label>${this.escapeHtml(todo.text)}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${this.escapeHtml(todo.text)}">
      </li>
    `
  }

  bindTodoEvents() {
    // Toggle todo
    this.todoList.querySelectorAll('.toggle').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const li = e.target.closest('li')
        const id = li.dataset.id
        this.updateTodo(id, { completed: e.target.checked })
      })
    })
    
    // Delete todo
    this.todoList.querySelectorAll('.destroy').forEach(button => {
      button.addEventListener('click', (e) => {
        const li = e.target.closest('li')
        const id = li.dataset.id
        this.deleteTodo(id)
      })
    })
    
    // Edit todo
    this.todoList.querySelectorAll('label').forEach(label => {
      label.addEventListener('dblclick', (e) => {
        const li = e.target.closest('li')
        li.classList.add('editing')
        const editInput = li.querySelector('.edit')
        editInput.focus()
        editInput.select()
      })
    })
    
    // Save edit
    this.todoList.querySelectorAll('.edit').forEach(input => {
      const saveEdit = () => {
        const li = input.closest('li')
        const id = li.dataset.id
        const text = input.value.trim()
        
        if (text) {
          this.updateTodo(id, { text })
        } else {
          this.deleteTodo(id)
        }
        
        li.classList.remove('editing')
      }
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveEdit()
        }
      })
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          input.value = this.todos[input.closest('li').dataset.id].text
          input.closest('li').classList.remove('editing')
        }
      })
      
      input.addEventListener('blur', saveEdit)
    })
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize SBP selectors for demo (Group Income architecture)
  sbp.selectors.register({
    
    'chelonia/contract/state': async (contractID) => {
      // Return identity contract state (no todos in state - they're in KV store)
      const contract = demoStorage.contracts[contractID]
      return {
        ...contract?.data
      }
    },
    
    'chelonia/kv/set': (contractID, key, value) => {
      console.log(`KV Set: ${contractID}[${key}] = ${value}`)
      if (!demoStorage.kvStore[contractID]) {
        demoStorage.kvStore[contractID] = {}
      }
      demoStorage.kvStore[contractID][key] = value
    },
    
    'chelonia/kv/get': (contractID, key) => {
      console.log(`KV Get: ${contractID}[${key}]`)
      return demoStorage.kvStore[contractID]?.[key] || null
    },
    
    'chelonia/kv/delete': (contractID, key) => {
      console.log(`KV Delete: ${contractID}[${key}]`)
      if (demoStorage.kvStore[contractID]) {
        delete demoStorage.kvStore[contractID][key]
      }
    }
  })
  
  // Start the app
  new TodoMVCApp()
})
