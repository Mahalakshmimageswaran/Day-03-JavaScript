// To do list 

1. Main flow 
┌─────────────────────────────┐
│ 1. App Opens in Browser     │
└───────────────┬─────────────┘
                │
                ▼
   useEffect (LOAD tasks from localStorage)
                │
                ▼
┌────────────────────────────────────────┐
│ 2. State gets old saved tasks (if any) │
└───────┬────────────────────────────────┘
        │
        ▼
 UI shows -> Sidebar, Tabs, Input, Tasks List
        │
        │
        │  (User interacts)
        ▼





2. when user adds a task 

User types task → clicks Add
        │
        ▼
addTask() function runs
        │
        ▼
setTasks() updates state
        │
        ▼
Re-render → New task visible on screen


3.When user marks a task complete

User clicks check icon
        │
        ▼
toggleTask(id)
        │
        ▼
Updates completed: true/false
        │
        ▼
setTasks() updates state
        │
        ▼
Re-render → Task becomes crossed / checked


4.When user deletes a task

User clicks delete icon
        │
        ▼
deleteTask(id)
        │
        ▼
setTasks() removes task from list
        │
        ▼
Re-render → Task disappears from screen


5.When user changes priority

User selects High / Medium / Low
        │
        ▼
updatePriority(id, newPriority)
        │
        ▼
setTasks() updates only priority
        │
        ▼
Re-render → Color / sorting changes



6.When user updates date

User picks a new date
        │
        ▼
updateDate(id, newDate)
        │
        ▼
setTasks() updates only date
        │
        ▼
Re-render → New date visible on UI


7.When user switches tabs (All / Pending / Completed / Today)

User clicks a tab
        │
        ▼
setActiveTab(tab)
        │
        ▼
getFilteredTasks() returns only matching tasks
        │
        ▼
Re-render → Only selected view shown

Automatic Saving Flow

Any setTasks() runs
        │
        ▼
Tasks changed → useEffect(save) triggers
        │
        ▼
localStorage.setItem("todos")
        │
        ▼
Tasks are saved permanently in browser


COMPLETE REACT LIFECYCLE OF APP

     ┌─────────────────────────────┐
     │ App opens (TodoApp starts) │
     └───────────────┬─────────────┘
                     │
                     ▼
      useEffect(load) → load saved tasks
                     │
                     ▼
            State receives tasks
                     │
                     ▼
             UI displays tasks
       ┌─────────────┴─────────────┐
       │      USER ACTIONS         │
       │  (add / delete / complete │
       │    edit / change tabs)    │
       └─────────────┬─────────────┘
                     │
                     ▼
             setTasks() runs
                     │
                     ▼
               State changes
                     │
                     ▼
       🔥 Re-render → new UI shown
                     │
                     ▼
      useEffect(save) → save to localStorage
                     │
                     ▼
      ✔ Data stays safe even after refresh
