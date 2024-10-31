const addTaskBtn = document.querySelector('#add-task');
const taskAddingModal = document.querySelector('#tasks-adding-modal');
const closeModalBtn = document.querySelector('#close-modal');
const todoListBody = document.querySelector('.todo-list-body');
const doingListBody = document.querySelector('.doing-list-body');
const doneListBody = document.querySelector('.done-list-body');
const addAnotherTaskBtn = taskAddingModal.querySelector('#add-another-task-btn');
const addTaskTitle = taskAddingModal.querySelector('#add-task-title');
const addTaskDescription = taskAddingModal.querySelector('#add-task-description');
const addPriority = taskAddingModal.querySelector('#add-priority');
const addDueDate = taskAddingModal.querySelector('#add-due-date');
const addToList = taskAddingModal.querySelector('#add-to-list');
const addTasksPreviewList = taskAddingModal.querySelector('#add-tasks-preview-list');
const saveAddBtn = taskAddingModal.querySelector('#save-add');
const todoTotalTasks = document.querySelector('#todo-total-tasks');
const doingTotalTasks = document.querySelector('#doing-total-tasks');
const doneTotalTasks = document.querySelector('#done-total-tasks');
const filterPriority = document.querySelector('#filter-priority');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

const addTasksArray = [];
let toDoCount = 1;
let doingCount = 4;
let doneCount = 0;

addTaskBtn.addEventListener('click', function () {
    taskAddingModal.classList.remove('hidden');
    taskAddingModal.classList.add('flex');
    window.addEventListener('click', closeModalOutside);
});

closeModalBtn.addEventListener('click', closeModalAdd);

function closeModalAdd() {
    if (addTasksPreviewList.childElementCount > 1) {
        let confirmation = confirm("You have unsaved data. Do you want to discard them?");
        if (confirmation == false) {
            return;
        }
    }
    clearData();
    taskAddingModal.classList.add('hidden');
    taskAddingModal.classList.remove('flex');
}

function clearData() {
    for (i = 0; i < addTasksPreviewList.childElementCount - 1; i++) {
        addTasksPreviewList.children[i].remove();
        addTaskTitle.value = "";
        addTaskDescription.value = "";
        addPriority.value = "Select";
        addDueDate.value = "";
        addToList.value = "Select";
        addTasksArray.pop();
    }
}


function closeModalOutside(e) {
    if (e.target == taskAddingModal) {
        closeModalAdd();
        window.removeEventListener('click', closeModalOutside);
    }
}

// dd

window.addEventListener('click', closeModalOutside);

document.querySelectorAll('.delete-task').forEach((item) => {
    item.addEventListener('click', function() {
        showConfirmModal(item);
    });
});

function showConfirmModal(target) {
    const div = document.createElement('div');
    div.id = "confirm-delete-modal";
    div.className = "flex w-full h-screen fixed top-0 left-0 bg-opacity-60 bg-gray-900 justify-center items-center";
    div.innerHTML = `
    <div class="bg-white rounded-xl w-2/5 h-72 shadow-lg border border-gray-500 flex flex-col justify-between">
      
      <div class="h-16 flex items-center px-7 justify-between border-b border-gray-300">
        <h2 class="font-semibold text-lg">Confirm delete</h2>
        <button role="button" class="font-bold text-lg text-red-500" id="close-confirm-delete-modal">X</button>
      </div>

      <div class="py-4 px-10">
        <p>Do you really want to delete the card <b>"${target.parentElement.querySelector('h3').textContent.trim()}"</b>?</p>
      </div>
      
      <div class="h-16 flex items-start px-7">
        <button role="button" class="px-5 py-2 rounded bg-red-600 text-gray-50" id="confirm-delete-btn">Confirm</button>
      </div>

    </div>`;

    document.body.append(div);

    window.addEventListener('click', function (e) {
        closeConfirmModal(e, div);
    });

    div.querySelector('#close-confirm-delete-modal').addEventListener('click', function () {
        div.remove();
    });
    div.querySelector("#confirm-delete-btn").addEventListener('click', function () {
        // target.parentElement.remove();
        target.parentElement.classList.add("animate-deleted-card");
        setTimeout(() => {
            target.parentElement.remove();

            if (todoListBody.childElementCount == 0) {
                const para = document.createElement('p');
                para.className = "text-center text-gray-500 pt-6 px-7";
                para.textContent = "This list is empty, add or move a card here to be shown.";
                todoListBody.append(para)
            } else if (doingListBody.childElementCount == 0) {
                const para = document.createElement('p');
                para.className = "text-center text-gray-500 pt-6 px-7";
                para.textContent = "This list is empty, add or move a card here to be shown.";
                doingListBody.append(para)
            } else if (doneListBody.childElementCount == 0) {
                const para = document.createElement('p');
                para.className = "text-center text-gray-500 pt-6 px-7";
                para.textContent = "This list is empty, add or move a card here to be shown.";
                doneListBody.append(para)
            }
        }, 950);
        div.remove();

        
    });
}

function closeConfirmModal(e, el) {
    if (e.target == el) {
        el.remove();
        window.addEventListener('click', function() {
            closeConfirmModal(e, div);
        })
    }
}

addAnotherTaskBtn.addEventListener('click', function () {

    if (this.hasAttribute("disabled")) {
        return;
    }

    let errorExist = false;

    if (addTaskTitle.value.trim().length < 3) {
        addTaskTitle.classList.add("placeholder:text-red-500");
        errorExist = true;
    } else {
        addTaskTitle.classList.remove("placeholder:text-red-500");
    }
    if (addPriority.value == "Select") {
        addPriority.style.borderColor = "red";
        errorExist = true;
    } else {
        addPriority.style.borderColor = "";
    }
    if (addDueDate.value == "") {
        addDueDate.style.borderColor = "red";
        errorExist = true;
    } else {
        addDueDate.style.borderColor = "";
    }
    if (addToList.value == "Select") {
        addToList.style.borderColor = "red";
        errorExist = true;
    } else {
        addToList.style.borderColor = "";
    }

    if (errorExist == false) {
        const button = document.createElement('button');
        button.role = "button";
        button.dataset.index = addTasksPreviewList.childElementCount - 1;
        button.textContent = "T" + addTasksPreviewList.childElementCount;
        button.className = "w-14 pb-0.5 rounded text-gray-50 border-2";
        if (addPriority.value == "P3") {
            button.classList.add("bg-lime-500");
        } else if (addPriority.value == "P2") {
            button.classList.add("bg-yellow-500");
        } else {
            button.classList.add("bg-red-500");
        }
        
        addTasksArray.push({title: addTaskTitle.value, description: addTaskDescription.value, priority: addPriority.value, dueDate: addDueDate.value, list: addToList.value});
        
        // On click on the tab, show its details

        button.addEventListener("click", function () {
            if (this.hasAttribute('data-active')) {
                this.removeAttribute("data-active");
                addTaskTitle.value = "";
                addTaskDescription.value = "";
                addPriority.value = "Select";
                addDueDate.value = "";
                addToList.value = "Select";
                addAnotherTaskBtn.removeAttribute('disabled');

                this.classList.remove("border-blue-700");
            } else {
                let index = this.dataset.index;
                
                this.parentElement.querySelectorAll("button").forEach((item) => {
                    item.classList.remove("border-blue-700");
                    item.removeAttribute("data-active");
                });
    
                this.classList.add("border-blue-700");
    
                this.setAttribute('data-active', "true")
                addAnotherTaskBtn.setAttribute('disabled', '');
                
                addTaskTitle.value = addTasksArray[+index].title;
                addTaskDescription.value = addTasksArray[+index].description;
                addPriority.value = addTasksArray[+index].priority;
                addDueDate.value = addTasksArray[+index].dueDate;
                addToList.value = addTasksArray[+index].list;
            }
        });
        
        addTasksPreviewList.lastElementChild.before(button);

        addTaskTitle.value = "";
        addTaskDescription.value = "";
        addPriority.value = "Select";
        addDueDate.value = "";
        addToList.value = "Select";
    }
});

saveAddBtn.addEventListener("click", function () {
    let monthNames = ["Jan", "Fev", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (const item of addTasksArray) {
        const task = document.createElement('div');
        task.role = "button";
        task.className = `border-l-4 ${item.priority == "P3" ? "border-lime-500" : (item.priority == "P2" ? "border-yellow-500" : "border-red-500")} shadow bg-white px-3 pt-2 pb-4 flex justify-between items-center mb-4 hover:bg-slate-200 transition-colors`;

        dateParts = item.dueDate.split("-");

        task.innerHTML = 
        `<div class="w-11/12">
            <h3 class="mb-1 font-semibold">${item.title}</h3>
            <p class="pe-3 text-ellipsis overflow-hidden text-nowrap text-gray-500 mb-2">${item.description}</p>
            <div class="flex">
            <span class="${item.priority == "P3" ? "bg-lime-500" : (item.priority == "P2" ? "bg-yellow-500" : "bg-red-500")} text-gray-100 text-xs font-medium me-2 px-4 py-1 rounded-md">${item.priority}</span>
            <span class="bg-gray-50 text-dark-500 border text-xs font-medium me-2 px-4 py-1 rounded-md inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" height="15" class="me-2 inline-block"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                <path d="M128 0c13.3 0 24 10.7 24 24l0 40 144 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 40 0c35.3 0 64 28.7 64 64l0 16 0 48 0 256c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 192l0-48 0-16C0 92.7 28.7 64 64 64l40 0 0-40c0-13.3 10.7-24 24-24zM400 192L48 192l0 256c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-256zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                </svg>
                ${dateParts[2]} ${monthNames[+dateParts[1] - 1]} ${dateParts[0]}
            </span>
            </div>
        </div>
        <button role="button" class="ms-auto delete-task">
            <svg width="17" height="17" class="fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>
        </button>`;

        task.querySelector(".delete-task").addEventListener("click", function () {
            let target = this;
            showConfirmModal(target);
        });

        if (item.list == "ToDo") {
            todoListBody.append(task);
        } else if (item.list == "Doing") {
            doingListBody.append(task);
        } else {
            if (doneCount == 0) {
                doneListBody.innerHTML = "";
            }
            doneListBody.append(task);
            doneCount++;
            doneTotalTasks.textContent = doneCount;
        }
    }
    // clearData();
});

///////////////////////////////////////////////
/// Filter Tasks
///////////////////////////////////////////////

filterPriority.addEventListener("change", function () {
    filterTasks();
});

searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    filterTasks();
});

function filterTasks() {
    const tasksInTodo = todoListBody.children;
    const tasksInDoing = doingListBody.children;
    const tasksInDone = doneListBody.children;
    
    for (task of tasksInDoing) {
        if (task.querySelector("h3").textContent.search(searchInput.value) >= 0 && task.querySelector(".task-priority").textContent.search(filterPriority.value) >= 0) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    }
    for (task of tasksInTodo) {
        if (task.querySelector("h3").textContent.search(searchInput.value) >= 0 && task.querySelector(".task-priority").textContent.search(filterPriority.value) >= 0) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    }
    for (task of tasksInDone) {
        try {
            if (task.querySelector("h3").textContent.search(searchInput.value) >= 0 && task.querySelector(".task-priority").textContent.search(filterPriority.value) >= 0) {
                task.classList.remove('hidden');
            } else {
                task.classList.add('hidden');
            }
        } catch {

        }
    }
}