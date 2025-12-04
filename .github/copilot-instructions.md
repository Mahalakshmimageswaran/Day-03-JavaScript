# AI Copilot Instructions - TaskFlow Todo App

## Project Overview
**TaskFlow** is a React + Vite todo application with task management features (add, edit, delete, filter, prioritize). It's a learning project for frontend development deployed to GitHub Pages at `https://mahalakshmimageswaran.github.io/todo-app`.

## Architecture & Data Flow

### Core State Management (App.jsx)
- **Single React component** managing all state (tasks, filters, form inputs)
- **State structure**: `tasks` array contains objects with: `{ id, title, date, priority, completed, editMode }`
- **localStorage persistence**: Tasks auto-save on state changes via `useEffect` dependency on `tasks`
- **Two-phase rendering**: 
  1. Filter tasks by tab (all/pending/completed/high-priority/today) + search
  2. Sort by priority (high→medium→low)

### Component Structure (src/App.jsx)
- `App()`: Main container with sidebar (left) and main content area (right)
- `Stat()`: Reusable statistics card component
- **Sidebar**: Input form (title, date, priority), stats, clear-completed button
- **Main area**: Tab navigation, search bar, task list with inline editing

### UI Library
- **Tailwind CSS**: All styling (imported as `className` strings)
- **Lucide React icons**: `Trash2`, `Plus`, `Calendar`, `CheckCircle`, `Circle`
- **No component library**: Built from scratch with semantic HTML + Tailwind

## Key Patterns & Conventions

### State Updates Pattern
All state mutations use immutable patterns:
```jsx
// Modify single task property
setTasks(tasks.map(t => t.id === id ? { ...t, property: newValue } : t))
// Filter tasks
setTasks(tasks.filter(t => condition))
// Add to beginning of list
setTasks([newTask, ...tasks])
```

### Tab Filtering Logic
- **Tabs**: `'all'` (default), `'pending'`, `'completed'`, `'high'` (priority), `'today'` (date)
- Each tab applies specific filter on `filteredTasks` (chainable `.filter()` calls)
- **Today filter**: Compares task date against `new Date().toISOString().split('T')[0]`

### Priority System
- **Values**: `'low'` (green border), `'medium'` (yellow), `'high'` (red)
- **Sorting**: Object `{ high: 0, medium: 1, low: 2 }` for priority ordering
- **Visual indicator**: Left border color on task card reflects priority

### Inline Editing
- Tasks have `editMode` boolean flag
- Double-click title toggles edit mode (shows input field)
- Blur event saves the edit (auto-closes input)
- Completed tasks cannot change priority (disabled select)

## Build & Development Workflow

### Commands
```bash
npm run dev       # Start Vite dev server (HMR enabled)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run deploy    # Deploy to GitHub Pages (runs predeploy hook)
```

### Build Configuration (vite.config.js)
- `base: "/todo-app/"` - Required for GitHub Pages subdirectory deployment
- `@vitejs/plugin-react` - Enables React Fast Refresh (JSX HMR without reload)

### Deployment Pipeline
1. `npm run deploy` triggers `predeploy` hook
2. `predeploy` runs `npm run build` (generates dist/)
3. `gh-pages` package deploys dist/ to gh-pages branch
4. Site appears at `https://mahalakshmimageswaran.github.io/todo-app/`

## Code Quality

### ESLint Rules (eslint.config.js)
- **Extends**: `js.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- **Custom rule**: `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]` - Allows unused variables starting with uppercase (components) or underscore
- **Target**: ES2020, JSX support, browser globals

### Naming Conventions
- `.jsx` for React components (App.jsx, main.jsx)
- `.js` for utilities (currently ap.js is empty)
- **Note**: `ap.js` appears to be a typo for `app.js` - clarify purpose or consider renaming

## Important Files Reference
- **App.jsx**: All component logic, state, UI rendering
- **App.css**: Component-specific styles (check for any overrides)
- **index.css**: Global styles (Tailwind base + customs)
- **main.jsx**: React app entry point (ReactDOM.createRoot)
- **vite.config.js**: Vite config with GitHub Pages base path

## Common Tasks for AI Agents

1. **Add new feature**: Extend state in App.jsx, add handlers, add UI in render section
2. **Modify task properties**: Update task object structure + form inputs + display logic
3. **Add new tab/filter**: Add to tab list, add filter condition in `filteredTasks` chain
4. **Fix localStorage**: Ensure useEffect dependency array includes `tasks`
5. **Styling tweaks**: Modify Tailwind `className` strings in JSX
6. **Deploy changes**: Push to main branch, run `npm run deploy` from project root

## Development Notes
- **No backend**: All data is client-side (localStorage only)
- **No routing**: Single-page app with tab-based navigation
- **No API calls**: Perfect for learning frontend fundamentals
- **React 19**: Using latest React with no breaking changes expected
- **Fast Refresh**: Edit components and see changes instantly during dev
