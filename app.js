// DOM selectors
const todoListElement = document.getElementById("todos");
const todoElement = document.querySelectorAll(".todo");
const insertBtnElement = document.getElementById("insertBtn");
const todoInput = document.getElementById("todo-input");
const toolTipElement = document.getElementById("tooltip-box");
const sortIconElement = document.getElementById("sort-icon");
const deleteIconElement = document.querySelector(".wrong-icon");
const backDropElement = document.querySelector(".backdrop");





let todos = [];

class TaskTodo {
  todo;
  id;
  date;

  constructor(todo = "") {
    this.todo = todo;
    this.id = TaskTodoHelper.generateId();
  }

  addTaskTodo() {
    const todoObj = {
      id: this.id,
      todo: this.todo.trim(),
    };
    todos.push(todoObj);
  }

  createHtmlTodoElement(todo) {
    const todoDiv = Dom.createElement("div", {
      className: "todo",
      id: `todo-${todo.id}`,
    });
    const todoInput = Dom.createElement("input", {
      type: "text",
      value: todo.todo.trim(),
    });
    const wrongIconDiv = Dom.createElement("div", {
      className: "wrong-icon",
    });
    const wrongSign = Dom.createElement("p", { textContent: "X" });

    wrongIconDiv.appendChild(wrongSign);
    todoDiv.appendChild(todoInput);
    todoDiv.appendChild(wrongIconDiv);
    todoListElement.appendChild(todoDiv);

    return todoDiv;
  }
}

class TaskTodoHelper {
  static generateId() {
    return Math.floor(Math.random() * 100000000) + 1;
  }

  static sortTodosAsc() {
    const sortedTodos = [...todos];

    sortedTodos.sort((firstTodo, secondTodo) => {
      const first = firstTodo.todo.toLowerCase();
      const second = secondTodo.todo.toLowerCase();
      if (first > second) return 1;
      if (first < second) return -1;
      return 0;
    });

    todos = [...sortedTodos];
  }

  static sortTodosDesc() {
    const sortedTodos = [...todos];

    sortedTodos.sort((firstTodo, secondTodo) => {
      const first = firstTodo.todo.toLowerCase();
      const second = secondTodo.todo.toLowerCase();
      if (first > second) return -1;
      if (first < second) return 1;
      return 0;
    });

    todos = [...sortedTodos];
  }

  static reloadTaskTodos() {
    Dom.removeAllElements(todoListElement);

    todos.forEach((todo) => {
      const todoDiv = Dom.createElement("div", {
        className: "todo",
        id: `todo-${todo.id}`,
      });
      const todoInput = Dom.createElement("input", {
        type: "text",
        value: todo.todo,
      });
      const wrongIconDiv = Dom.createElement("div", {
        className: "wrong-icon",
      });
      const wrongSign = Dom.createElement("p", { textContent: "X" });

      wrongIconDiv.appendChild(wrongSign);

      todoDiv.appendChild(todoInput);
      todoDiv.appendChild(wrongIconDiv);

      todoListElement.appendChild(todoDiv);
    });

    todoListElement.scrollTo({ top: 0, behavior: "smooth" });
  }

  static addTodoElement() {
    if (Dom.hasElement(todoInput)) {
      const todo = new TaskTodo(todoInput.value);
      todo.addTaskTodo();
      const newTodoElement = todo.createHtmlTodoElement(todo);
      document.getElementById(newTodoElement.id).scrollIntoView();
      todoInput.value = "";
    } else {
      toolTipElement.classList.add("visible");

      setTimeout(() => {
        toolTipElement.classList.remove("visible");
      }, 2000);
    }
  }

  static removeTaskTodo(todoId) {
    let copiedTodos = [...todos];
    copiedTodos = copiedTodos.filter(
      (todo) => todo.id != todoId.replace("todo-", "")
    );
    todos = [...copiedTodos];
  }
}

class Dom {
  static createElement(elementType = "div", properties) {
    const element = document.createElement(elementType);
    Object.assign(element, properties);
    return element;
  }

  static hasElement(element) {
    if (element.value.trim() === "" || element.value.trim() === null)
      return false;

    return true;
  }

  static removeAllElements(parent) {
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }

  static removeChild(parent, child) {
    parent.removeChild(child);
  }
}

insertBtnElement.addEventListener("click", TaskTodoHelper.addTodoElement);

sortIconElement.addEventListener("click", () => {
  sortIconElement.classList.toggle("rotate");

  if (sortIconElement.classList.contains("rotate")) TaskTodoHelper.sortTodosDesc();
  else TaskTodoHelper.sortTodosAsc();

  TaskTodoHelper.reloadTaskTodos();
});

todoListElement.addEventListener("click", (e) => {
  const deleteIcon = e.target.closest("p");
  if (deleteIcon !== null) {
    const todoBox = deleteIcon.closest(".todo");
    const todoId = todoBox.id;
    TaskTodoHelper.removeTaskTodo(todoId);
    Dom.removeChild(todoListElement, todoBox);
  }
});

deleteIconElement.addEventListener("click", () => (todoInput.value = ""));
