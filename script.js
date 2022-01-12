const todoList = document.querySelector('#todo-list');
const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');

let todos = [];

const listTodos = async () => {
  try{
    const res = await fetch('https://jsonplaceholder.typicode.com/todos')

    if(res.status !== 200) {
      return new Error('Unable to obtain list')
    }
    todos = await res.json()
    todoList.innerHTML = '';
    for(let i = 0; i < 10; i++){
      todoList.innerHTML += `
      <a href="#" class="list-group-item d-flex list-group-item-action" aria-current="true">
    <div class="d-flex w-100 flex-column justify-content-between">
      <small>ID: ${todos[i].id}</small>
      <h5 class="mb-1">${todos[i].title}</h5>
    </div>
    <div class="form-check d-flex justify-content-center align-items-center">
      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
      <button class="btn btn-danger ms-2 d-none" id="btnDelete">X</button>
    </div>
  </a>
      `
    }
  }
  catch(err){
    console.log(err.message)
  }
}



const addTodo = (input) => {
  fetch('https://jsonplaceholder.typicode.com/todos', {
  method: 'POST',
  body: JSON.stringify({
    id: 1,
    completed: false,
    title: input,
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));
}
listTodos();
// console.log(listTodos());

addBtn.addEventListener('click', () => {
  addTodo(input.value);
})