const todoList = document.querySelector('#todo-list');
const doneList = document.querySelector('#done-list');
const input = document.querySelector('#todoInput');
const inputError = document.querySelector('#todoInput-error')
const addBtn = document.querySelector('#addBtn');
const resError = document.querySelector('#resError');






let todos = [];
let doneTodos = [];


const validation = () => {
  
  if (input.value === '') {
    input.classList.remove('is-valid')
    input.classList.add('is-invalid')
    inputError.innerText = 'Your todo cannot be empty'
    return false;
  }
  else {
    input.classList.remove('is-invalid')
    input.classList.add('is-valid')
    return true;
  }
}

const completedTodo = (aTag, delBtn, checkbox) => {
 
    delBtn.classList.remove('d-none')
    checkbox.checked = true;
    aTag.classList.add('done')
  
}

const listTodosOnLoadup = async () => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/?_limit=10')
    
    if (res.status !== 200) {
      throw new Error(`Unable to fetch wanted URL. Status ${res.status}`)
    }
    todos = await res.json()
    resError.classList.remove('error')
    resError.classList.add('d-none')
    listTodos();
    
  }
  catch (err) {
    console.log(err.message)
    resError.classList.add('error')
    resError.classList.remove('d-none')
    resError.innerText = `${err.message}`
  }
}

const createDoneElement = todo => {
  let aTag = document.createElement('a')
  aTag.classList.add('list-group-item', 'd-flex', 'list-group-item-action', 'justify-content-between', 'align-items-center', 'done')
  aTag.setAttribute('id', 'todo')

  let title = document.createElement('h5');
  title.classList.add('text-center')
  title.innerText = todo.title;

  aTag.appendChild(title)

  return aTag;
}

const addToDoneList = () => {
  doneList.innerHTML = '';

  doneTodos.forEach(todo => {
    doneList.appendChild(createDoneElement(todo))
  })
}

const removeTodo = async (id, aTag) => {
  try{
    
    await fetch('https://jsonplaceholder.typicode.com/todos/' + id.id, {
      method: 'DELETE',
    })
    
    doneTodos.push(id)
    todos = todos.filter(todo => todo.id !== id.id)
    addToDoneList();
    
    aTag.remove();
  }
  catch (err) {
    console.log(err.message)
    resError.classList.add('error')
    resError.classList.remove('d-none')
    resError.innerText = `${err.message}`
  }
  

}

const createTodoElement = todo => {
  let aTag = document.createElement('a')
  aTag.classList.add('list-group-item', 'd-flex', 'list-group-item-action', 'justify-content-between', 'align-items-center')
  aTag.setAttribute('id', 'todo')

  let title = document.createElement('h5');
  title.classList.add('text-center')
  title.innerText = todo.title;

  let checkAndButton = document.createElement('div');
  checkAndButton.classList.add('form-check', 'd-flex', 'justify-content-center', 'align-items-center')

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input')

  let delBtn = document.createElement('button');
  delBtn.classList.add('btn', 'btn-danger', 'ms-2', 'd-none')
  delBtn.innerText = 'X'

  

  delBtn.addEventListener('click', () => removeTodo(todo, aTag))
  aTag.addEventListener('click', e => {
    console.log(e.target.type)
    if(e.target.type !== 'submit'){

      if(checkbox.checked){
        checkbox.checked = false
        fetch('https://jsonplaceholder.typicode.com/todos/' + todo.id, {
          method: 'PATCH',
          body: JSON.stringify({
            completed: false,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
        .then((response) => response.json())
        .then((json) => {
          const _todo = todos.find(u => u.id === json.id)
      const iTodo = todos.indexOf(_todo)
      
      
      todos[iTodo] = {
        id: todos[iTodo].id,
        title: todos[iTodo].title,
        completed: false
      }
      
    });
    aTag.classList.remove('done')
    delBtn.classList.add('d-none')
  }
  else{
    checkbox.checked = true;
    fetch('https://jsonplaceholder.typicode.com/todos/' + todo.id, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: true,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => {
      // console.log(json)
      const _todo = todos.find(u => u.id === json.id)
      const iTodo = todos.indexOf(_todo)
      
      todos[iTodo] = {
        id: todos[iTodo].id,
        title: todos[iTodo].title,
        completed: true
      }
      
    });
    completedTodo(aTag, delBtn, checkbox)
  }
  
}
})



checkbox.addEventListener('change', e => {
  
  if(checkbox.checked){
    checkbox.checked = false
    fetch('https://jsonplaceholder.typicode.com/todos/' + todo.id, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: false,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => {
      
      const _todo = todos.find(u => u.id === json.id)
      const iTodo = todos.indexOf(_todo)
      
      
      todos[iTodo] = {
        id: todos[iTodo].id,
        title: todos[iTodo].title,
        completed: false
      }
      
    });
      aTag.classList.remove('done')
      delBtn.classList.add('d-none')
    }
    else{
      checkbox.checked = true;
      fetch('https://jsonplaceholder.typicode.com/todos/' + todo.id, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: true,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => {
      
      const _todo = todos.find(u => u.id === json.id)
      const iTodo = todos.indexOf(_todo)
      
      todos[iTodo] = {
        id: todos[iTodo].id,
        title: todos[iTodo].title,
        completed: true
      }
      
    });
      completedTodo(aTag, delBtn, checkbox)
    }
    
  })
  if(todo.completed){

    completedTodo(aTag, delBtn, checkbox)
  }

  checkAndButton.appendChild(checkbox)
  checkAndButton.appendChild(delBtn)

  aTag.appendChild(title)
  aTag.appendChild(checkAndButton)

  return aTag
}

const listTodos = () => {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    todoList.appendChild(createTodoElement(todo));
    
   
  })

  
}



const addTodo = (input) => {
  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify({
      id: 1,
      title: input,
      completed: false,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },

  })
    .then((response) => response.json())
    .then((json) => {
      
      let max = 0;
      todos.forEach(todo => {
        if(todo.id > max)
        max = todo.id
      })
      json.id = max + 1
      todos.push(json);
      
      listTodos();



    });
}



listTodosOnLoadup();





addBtn.addEventListener('click', e => {
  e.preventDefault();
  validation();
  
  if(validation()) addTodo(input.value);

  listTodos();
 
  input.value = '';
})









