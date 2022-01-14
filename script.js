const todoList = document.querySelector('#todo-list');
const input = document.querySelector('#todoInput');
const inputError = document.querySelector('#todoInput-error')
const addBtn = document.querySelector('#addBtn');
const resError = document.querySelector('#resError');






let todos = [];



const validation = () => {
  console.log(input.value)
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

const completedTodo = () => {
  
  for(let i = 0; i < todos.length; i++){
    if(todos[i].completed){
      const todoDIV = document.querySelector('#todo' + todos[i].id)
      todoDIV.classList.add('done')
      todoDIV.children[1].children[0].checked = true;
      todoDIV.children[1].children[1].classList.remove('d-none');


    }
  }
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
    console.log(err)
    resError.classList.add('error')
    resError.classList.remove('d-none')
    resError.innerText = `${err.message}`
  }
}

const listTodos = () => {
  todoList.innerHTML = '';

  todos.forEach(todo => {
    todoList.insertAdjacentHTML('beforeend', `
    <a href="#" class="list-group-item d-flex list-group-item-action" id="todo${todo.id}" aria-current="true">
  <div class="d-flex w-100 flex-column justify-content-between">
    <small id="idNumber">${todo.id}</small>
    <h5 class="mb-1">${todo.title}</h5>
  </div>
  <div class="form-check d-flex justify-content-center align-items-center" id="${todo.id}">
    <input class="form-check-input" type="checkbox" value="" id="doneCheck">
    <button class="btn btn-danger ms-2 d-none" id="btnDelete${todo.id}">X</button>
  </div>
</a>
    `)
  })

  completedTodo();
}



const addTodo = (input) => {
  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    body: JSON.stringify({
      userId: 1,
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

const checkBox = (e, deleteBtn, todoDIV) => {
  switch(e.target.type === 'checkbox'){
    case e.target.checked:
      fetch('https://jsonplaceholder.typicode.com/todos/' + e.target.parentNode.id, {
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
          const todo = todos.find(u => u.id === json.id)
          const iTodo = todos.indexOf(todo)
         
          todos[iTodo] = {
            userId: todos[iTodo].userId,
            id: todos[iTodo].id,
            title: todos[iTodo].title,
            completed: true
          }
          console.log(todos)
        });
        deleteBtn.classList.remove('d-none')
        todoDIV.classList.add('done')
        break;
    
    case !e.target.checked:
      fetch('https://jsonplaceholder.typicode.com/todos/' + e.target.parentNode.id, {
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
          const todo = todos.find(u => u.id === json.id)
          const iTodo = todos.indexOf(todo)
         
          todos[iTodo] = {
            userId: todos[iTodo].userId,
            id: todos[iTodo].id,
            title: todos[iTodo].title,
            completed: false
          }
          console.log(todos)
        });
  
      deleteBtn.classList.add('d-none');
      todoDIV.classList.remove('done')
  
    }
}




listTodosOnLoadup();





addBtn.addEventListener('click', e => {
  e.preventDefault();
  console.log(input.value)
  validation();
  console.log(validation());
  if(validation()){
    addTodo(input.value);
  }
  listTodos();
 
  input.value = '';
})



todoList.addEventListener('click', e => {
  
  const deleteBtn = document.querySelector('#btnDelete' + e.target.parentNode.id)
  const todoDIV = document.querySelector('#todo' + e.target.parentNode.id)
  console.log(todos)
  
  checkBox(e, deleteBtn, todoDIV);
    
  if(e.target.type === 'submit'){
    e.preventDefault()
    
    fetch('https://jsonplaceholder.typicode.com/todos/' + e.target.parentNode.id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    todos = todos.filter(todo => todo.id != e.target.parentNode.id)
    
    listTodos();
  }
  
})






