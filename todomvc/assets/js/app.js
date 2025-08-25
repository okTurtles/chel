// TodoMVC App using Chelonia with CDN imports

class TodoMVCApp {
  constructor() {
    this.todos = {}
    this.filter = 'all'
    this.contractID = null
    
    // Wait for SBP/Chelonia to be available
    this.waitForLibraries().then(() => {
      this.initializeElements()
      this.bindEvents()
      this.render()
      
      // Check for existing login
      this.checkExistingLogin()
    })
  }

  async waitForLibraries() {
    // Wait for SBP to be loaded from CDN
    let attempts = 0
    const maxAttempts = 50 // 5 seconds max wait
    
    while (!window.sbp && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    
    if (window.sbp) {
      console.log('📚 SBP ready for TodoMVC')
      // Check if we have Chelonia or fallback selectors
      if (window.chelonia) {
        console.log('✅ Chelonia library loaded')
      } else {
        console.log('📝 Using Chelonia-compatible selectors with SBP')
      }
      // Ensure our TodoMVC KV selectors are registered before proceeding
      if (!window.todomvcKVReady) {
        let kvAttempts = 0
        while (!window.todomvcKVReady && kvAttempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100))
          kvAttempts++
        }
      }
      if (!window.todomvcKVReady) {
        console.warn('⚠️ KV selectors not ready after wait; proceeding may cause errors')
      }
    } else {
      console.error('❌ SBP not loaded - app cannot function')
      throw new Error('SBP is required for TodoMVC')
    }
  }

  checkExistingLogin() {
    // Check if user is already logged in
    const userData = localStorage.getItem('todomvc_user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        this.contractID = user.contractID
        console.log('🔄 Restored login for:', user.username)
        // Ensure the login modal is hidden if it was visible
        if (this.loginModal) {
          this.loginModal.style.display = 'none'
        }
        this.loadTodos().then(() => this.render())
        return
      } catch (e) {
        console.warn('⚠️ Invalid stored user data:', e)
        localStorage.removeItem('todomvc_user')
      }
    }
    
    // Show login modal if not logged in
    this.showLoginModal()
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

  showLoginModal() {
    if (this.loginModal) {
      this.loginModal.style.display = 'flex'
      if (this.usernameInput) {
        this.usernameInput.focus()
      }
    }
  }

  async handleLogin(e) {
    e.preventDefault()
    
    const username = this.usernameInput.value.trim()
    const email = this.emailInput.value.trim()
    
    if (!username) return
    
    try {
      // Create or load identity contract using TodoMVC selectors
      console.log('🔐 Starting TodoMVC identity creation/login...')
      
      // Create identity contract using our TodoMVC selector
      const contract = await window.sbp('todomvc/identity/create', username, email)
      this.contractID = contract.id
      
      console.log('✅ Identity contract ready:', this.contractID)
      
      // Store user info in localStorage for demo persistence
      localStorage.setItem('todomvc_user', JSON.stringify({
        contractID: this.contractID,
        username,
        email: email || null,
        loginTime: new Date().toISOString()
      }))
      
      // Hide login modal
      this.loginModal.style.display = 'none'
      
      // Load todos using TodoMVC KV selectors
      await this.loadTodos()
      this.render()
      
      console.log('🎉 Login successful! Ready to use TodoMVC with SBP and Chelonia.')
      
    } catch (error) {
      console.error('❌ Login failed:', error)
      alert('Login failed. Please try again.')
    }
  }

  async loadTodos() {
    if (!this.contractID) {
      console.log('⚠️ loadTodos: No contractID, skipping')
      return
    }
    
    try {
      console.log('🔄 loadTodos: Starting load operation...')
      console.log('📋 loadTodos: contractID =', this.contractID)
      this.todos = {}
      
      // Use TodoMVC KV selectors that work with SBP
      console.log('🔍 loadTodos: Calling todomvc/kv/get...')
      const todosData = await window.sbp('todomvc/kv/get', this.contractID, 'todos')
      console.log('📖 loadTodos: KV GET completed')
      
      if (todosData) {
        // Data from KV is already parsed
        this.todos = todosData
        console.log('📋 loadTodos: Loaded', Object.keys(this.todos).length, 'todos from KV store')
        console.log('📄 loadTodos: Todo IDs:', Object.keys(this.todos))
      } else {
        console.log('📝 loadTodos: No existing todos found, starting fresh')
        this.todos = {}
      }
      
    } catch (error) {
      console.error('❌ loadTodos: Failed to load todos:', error)
      console.error('🔍 loadTodos: Error details:', error.stack)
      this.todos = {}
    }
  }

  async saveTodos() {
    if (!this.contractID) {
      console.log('⚠️ saveTodos: No contractID, skipping')
      return
    }
    
    try {
      console.log('💾 saveTodos: Starting save operation...')
      console.log('📋 saveTodos: contractID =', this.contractID)
      console.log('📊 saveTodos: Saving', Object.keys(this.todos).length, 'todos')
      
      // Use TodoMVC KV selectors that work with SBP
      console.log('🔄 saveTodos: Calling todomvc/kv/set...')
      await window.sbp('todomvc/kv/set', this.contractID, 'todos', this.todos)
      console.log('✅ saveTodos: KV SET completed successfully')
      
    } catch (error) {
      console.error('❌ saveTodos: Failed to save todos:', error)
      console.error('🔍 saveTodos: Error details:', error.stack)
    }
  }

  async addTodo(text) {
    if (!this.contractID) {
      console.log('⚠️ addTodo: No contractID, skipping')
      return
    }
    
    const id = Date.now().toString()
    const todo = {
      id,
      text: text.trim(),
      completed: false,
      createdDate: new Date().toISOString()
    }
    
    console.log('➕ addTodo: Creating new todo with ID:', id)
    console.log('📝 addTodo: Todo text:', text.trim())
    
    this.todos[id] = todo
    console.log('📊 addTodo: Total todos now:', Object.keys(this.todos).length)
    
    await this.saveTodos()
    this.render()
    
    console.log('✅ addTodo: Todo created and saved successfully')
  }

  async updateTodo(id, updates) {
    console.log('🔄 updateTodo: Updating todo ID:', id)
    console.log('📝 updateTodo: Updates:', updates)
    
    if (this.todos[id]) {
      const oldTodo = { ...this.todos[id] }
      
      // Merge updates with existing todo
      this.todos[id] = {
        ...this.todos[id],
        ...updates,
        updatedDate: new Date().toISOString()
      }
      
      console.log('📊 updateTodo: Before:', oldTodo)
      console.log('📊 updateTodo: After:', this.todos[id])
      
      // Save using Chelonia KV store
      await this.saveTodos()
      
      console.log('✅ updateTodo: Todo updated and saved successfully')
      this.render()
    } else {
      console.warn('⚠️ updateTodo: Todo not found with ID:', id)
    }
  }

  async deleteTodo(id) {
    console.log('🗑️ deleteTodo: Deleting todo ID:', id)
    
    if (this.todos[id]) {
      const deletedTodo = { ...this.todos[id] }
      console.log('📄 deleteTodo: Deleting todo:', deletedTodo.text)
      
      delete this.todos[id]
      console.log('📊 deleteTodo: Remaining todos:', Object.keys(this.todos).length)
      
      await this.saveTodos()
      this.render()
      
      console.log('✅ deleteTodo: Todo deleted and saved successfully')
    } else {
      console.warn('⚠️ deleteTodo: Todo not found with ID:', id)
    }
  }

  async toggleAll(completed) {
    if (!this.contractID) return
    
    try {
      // Update all todos
      for (const [id, todo] of Object.entries(this.todos)) {
        this.todos[id] = { ...todo, completed, updatedDate: new Date().toISOString() }
      }
      
      // Save all updates at once using TodoMVC KV store
      await this.saveTodos()
      
      this.render()
    } catch (error) {
      console.error('Failed to toggle all todos:', error)
    }
  }

  async clearCompleted() {
    if (!this.contractID) return
    
    try {
      // Delete completed todos
      const completedIds = Object.keys(this.todos).filter(id => this.todos[id].completed)
      
      for (const id of completedIds) {
        delete this.todos[id]
      }
      
      // Save updated todos list using TodoMVC KV store
      await this.saveTodos()
      
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
    
    // Render todo list using template-based DOM manipulation
    this.renderTodoList(filteredTodos)
    
    // Update todo count using proper DOM manipulation
    this.renderTodoCount(activeTodos.length)
    
    // Show/hide clear completed button
    this.clearCompletedBtn.style.display = completedTodos.length > 0 ? 'block' : 'none'
    
    // Bind todo item events
    this.bindTodoEvents()
  }

  renderTodoList(filteredTodos) {
    // Clear existing todo items
    this.todoList.replaceChildren()
    
    // Get template
    const template = document.getElementById('todo-template')
    
    // Create and append each todo item using template
    filteredTodos.forEach(todo => {
      const todoElement = this.createTodoElement(todo, template)
      this.todoList.appendChild(todoElement)
    })
  }

  createTodoElement(todo, template) {
    // Clone template content
    const todoElement = template.content.cloneNode(true).firstElementChild
    
    // Set data attributes and classes
    todoElement.dataset.id = todo.id
    if (todo.completed) {
      todoElement.classList.add('completed')
    }
    
    // Populate content using proper DOM manipulation (official TodoMVC structure)
    const checkbox = todoElement.querySelector('.toggle')
    const label = todoElement.querySelector('label')
    const editInput = todoElement.querySelector('.edit')
    const destroyButton = todoElement.querySelector('.destroy')
    
    checkbox.checked = todo.completed
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`)
    
    label.textContent = todo.text
    label.setAttribute('tabindex', '0')
    label.setAttribute('role', 'button')
    label.setAttribute('aria-label', `Edit todo: ${todo.text}`)
    
    editInput.value = todo.text
    editInput.setAttribute('aria-label', `Edit todo: ${todo.text}`)
    
    destroyButton.setAttribute('aria-label', `Delete todo: ${todo.text}`)
    
    return todoElement
  }

  renderTodoCount(activeCount) {
    // Clear existing content
    this.todoCount.replaceChildren()
    
    // Create elements using proper DOM manipulation
    const strongElement = document.createElement('strong')
    strongElement.textContent = activeCount.toString()
    
    const itemText = activeCount === 1 ? 'item' : 'items'
    const textNode = document.createTextNode(` ${itemText} left`)
    
    // Append elements
    this.todoCount.appendChild(strongElement)
    this.todoCount.appendChild(textNode)
  }

  bindTodoEvents() {
    // Prevent form submission for todo forms
    this.todoList.querySelectorAll('.view').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault()
      })
    })
    
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
    
    // Edit todo - multiple accessible ways to enter edit mode
    this.todoList.querySelectorAll('label').forEach(label => {
      const enterEditMode = (e) => {
        const li = e.target.closest('li')
        li.classList.add('editing')
        const editInput = li.querySelector('.edit')
        editInput.focus()
        editInput.select()
      }
      
      // Double-click for desktop users (official TodoMVC behavior)
      label.addEventListener('dblclick', enterEditMode)
      
      // Keyboard accessibility - Enter or Space key to edit
      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          enterEditMode(e)
        }
      })
      
      // Touch/mobile support - single tap after focus
      let tapCount = 0
      label.addEventListener('click', (e) => {
        tapCount++
        setTimeout(() => {
          if (tapCount === 1 && document.activeElement === label) {
            // Single tap on focused element = edit (mobile friendly)
            enterEditMode(e)
          }
          tapCount = 0
        }, 300)
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
}

// Initialize app when DOM is loaded and libraries are ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM loaded, starting TodoMVC with Chelonia...')
  
  // Start the app only after our KV selectors are ready to avoid race conditions
  const startApp = () => new TodoMVCApp()
  if (window.todomvcKVReady) {
    startApp()
  } else {
    const onReady = () => {
      window.removeEventListener('todomvc-kv-ready', onReady)
      startApp()
    }
    window.addEventListener('todomvc-kv-ready', onReady)
  }
})
