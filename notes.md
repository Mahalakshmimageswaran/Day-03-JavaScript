echnologies Used (with purpose)

React (Hooks) → manages UI, state, re-rendering (useState, useEffect)

JavaScript ES6 → core logic for add / delete / complete / update tasks

LocalStorage API → permanently saves tasks in browser (no data loss)

HTML5 + JSX → defines UI structure (sidebar, tabs, task list)

CSS / Tailwind → modern responsive styling and priority color system


-----------------------------------------------------------------------------
🧩 Modules / Functions & What They Do
Module / Function	Role
useEffect(load)	Loads saved tasks from localStorage when app opens
addTask()	Adds new task to list
toggleTask(id)	Marks a task as completed / uncompleted
deleteTask(id)	Removes a task from list
updatePriority(id)	Changes task priority (High / Medium / Low)
updateDate(id)	Updates due date
setActiveTab(tab)	Switches between All / Pending / Completed / Today
useEffect(save)	Saves tasks to localStorage after every change

-------------------------------------------------------------------------------

features of the To-Do App (impressively short)

1️⃣ Auto-Save System — Tasks never disappear, even after refresh
2️⃣ One-Tap Completion — Check icon instantly marks tasks as done
3️⃣ Smart Filtering Tabs — Switch views between All / Pending / Completed / Today
4️⃣ Task Intelligence — Priority + Due Date control for better planning
5️⃣ Reactive UI — Every change instantly reflects via React’s re-rendering