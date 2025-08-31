// Koneksi dengan server
const API_URL = 'http://localhost:3000/api/todos';

const todoList = document.getElementById('todoList');
const newTodoInput = document.getElementById('newTodoInput');
const addTodoBtn = document.getElementById('addTodoBtn');

// fungsi menampilkan todos
async function fetchTodos(){ // fetch yaitu mengambil data
    try {
        const response = await fetch(API_URL);
        if(!response.ok){
            throw new Error(`error status: ${response.status}`);
        }

        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('error fetching todos', error);
        todoList.innerHTML = '<li class="list-group-item text-danger">Komunikasi Error / Error Loading Data </li>';
    }
}

// fungsi merender todos
function renderTodos(todos){
    todoList.innerHTML = ''; // mengosongkan daftar yang ada
    todos.forEach(todo => {
        const li = document.createElement('li');
        todoList.appendChild(li)
        
        li.className = `list-group-item d-flex justfy-content-between align-item-center ${todo.completed ? 'list-group-item-success':''}`;
        li.dataset.id = todo.id; // simpan id di elemen li

        const todoText = document.createElement('span');
        todoText.textContent = todo.deskripsi;
        if(todo.completed){
            todoText.style.textDecoration = 'line-through';
            todoText.style.color = '#6c757d' //mengubah warna menjadi abu abu
        }
        
        todoText.textContent = todo.deskripsi;
        todoText.className= 'flex-grow-1 me-2';
        //tambahkan class bootstrap untuk dilihat
        
        
        todoText.addEventListener('click', () => toggleTodoStatus(todo.id));
        
        const actionDiv = document.createElement('div');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.addEventListener('click', ()=>deleteTodo(todo.id));

        // menjahit child
        actionDiv.appendChild(deleteButton)
        li.appendChild(todoText);
        li.appendChild(actionDiv);
        todoList.appendChild(li);
    })
}

// fungsi mentoggle todos
async function toggleTodoStatus(id){
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT'
            });

            if(!response.ok) {
                throw new Error(`error status: ${response.status}`);
            }

            const updatedTodo = await response.json();
            console.log('toggle todo:', updatedTodo);
            fetchTodos();
        } catch (error){
            console.error('error toggling todo status', error);
        }
};

// fungsi adding todos
async function addTodo(){
    const deskripsi = newTodoInput.value.trim();
    if(!deskripsi){
        alert('Gaboleh kosong');
        return;
    }

    let  text = {"deskripsi":deskripsi}
    try{
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(text)
        });

        if(!response.ok) {
                throw new Error(`error status: ${response.status}`);
        }

        const newTodo = await response.json();
        console.log('todo baru sudah ditambah:', newTodo);
        newTodoInput.value = '';
        fetchTodos();
    } catch (error){
        console.error('error adding todo status', error);
    }
}


async function deleteTodo(id){
    if(!confirm('apakah yakin??')){
        return;
    }

    try{
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if(!response.ok){
            if(response.status == 204){
                console.log(`Todo ${id} sukses dihapus`);
            } else {
                throw new Error(`error ${response.status}`);
            }
        }

        fetchTodos();

    } catch (error){
        console.error('error delete todo', error);
    }
}
addTodoBtn.addEventListener('click', addTodo);
document.addEventListener('DOMContentLoaded', fetchTodos);