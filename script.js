// Lists

const todoListBody = document.querySelector('.todo-list-body');
const doingListBody = document.querySelector('.doing-list-body');
const doneListBody = document.querySelector('.done-list-body');
const todoTotalTasks = document.querySelector('#todo-total-tasks');
const doingTotalTasks = document.querySelector('#doing-total-tasks');
const doneTotalTasks = document.querySelector('#done-total-tasks');
const listOptions = document.querySelectorAll('.list-options');

// Add Task

const taskAddingModal = document.querySelector('#tasks-adding-modal');
const closeAddModalBtn = document.querySelector('#close-add-modal');
const addAnotherTaskBtn = taskAddingModal.querySelector('#add-another-task-btn');
const addTaskTitle = taskAddingModal.querySelector('#add-task-title');
const addTaskDescription = taskAddingModal.querySelector('#add-task-description');
const addPriority = taskAddingModal.querySelector('#add-priority');
const addDueDate = taskAddingModal.querySelector('#add-due-date');
const addToList = taskAddingModal.querySelector('#add-to-list');
const addTasksPreviewList = taskAddingModal.querySelector('#add-tasks-preview-list');
const saveAddBtn = taskAddingModal.querySelector('#save-add');

// Modify Task

const taskModifyingModal = document.querySelector("#tasks-modifying-modal");
const modifyTaskTitle = document.querySelector("#modify-task-title");
const modifyTaskDescription = document.querySelector("#modify-task-description");
const modifyPriority = document.querySelector("#modify-priority");
const modifyDueDate = document.querySelector("#modify-due-date");
const modifyToList = document.querySelector("#modify-to-list");
const saveModifyBtn = taskModifyingModal.querySelector('#save-modify');
const closeModifyModal = taskModifyingModal.querySelector('#close-modify-modal');

// Filter

const filterPriority = document.querySelector('#filter-priority');
const filterDueDate = document.querySelector('#filter-due-date');
const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const filterClearBtn = document.querySelector("#filter-clear");

const addTasksArray = [];

///////////////////////////////////
/// Clear All
///////////////////////////////////

listOptions.forEach(function (item) {
    item.addEventListener("click", function (e) {
        if (!this.nextElementSibling) {
            e.stopPropagation();
            let optionsContainer = document.createElement('div');
            optionsContainer.className = "options-container absolute right-0 top-9 w-36 bg-white shadow-lg text-gray-500 px-4 py-3 rounded-lg border border-gray-400 font-semibold *:py-1 flex flex-col *:transition-colors";
            optionsContainer.innerHTML = 
                `<button type="button" class="z-10 clear-option hover:text-gray-900">Clear List</button>`;
            this.parentElement.append(optionsContainer);

            optionsContainer.querySelector('.clear-option').addEventListener('click', function () {
                clearAllTasks(item.parentElement.firstElementChild.firstElementChild.textContent.trim(), item.parentElement.nextElementSibling);
                item.nextElementSibling.remove();
            });

            function removeListOptions(e) {
                if (item.nextElementSibling && !optionsContainer.contains(e.target) && !e.target) {
                    item.nextElementSibling.remove();
                    document.removeEventListener('click', removeListOptions);
                }
            }
    
            document.addEventListener('click', removeListOptions);
        }
    });
});

// Remove list options

function clearAllTasks(listName, list) {
    const div = document.createElement('div');
    div.id = "confirm-delete-modal";
    div.className = "z-20 px-3 flex w-full h-screen fixed top-0 left-0 bg-opacity-60 bg-gray-900 justify-center items-center";
    div.innerHTML = `
    <div class="bg-white rounded-xl w-full max-w-xl h-72 shadow-lg border border-gray-500 flex flex-col justify-between">
      
      <div class="h-16 flex items-center px-7 justify-between border-b border-gray-300">
        <h2 class="font-semibold text-lg">Confirm delete</h2>
        <button role="button" class="font-bold text-lg text-red-500" id="close-confirm-delete-modal">X</button>
      </div>

      <div class="py-4 px-10">
        <p>Do you really want to delete all tasks in "${listName}" list?</p>
      </div>
      
      <div class="h-16 flex items-start px-7">
        <button role="button" class="px-5 py-2 rounded bg-red-600 text-gray-50" id="confirm-delete-btn">Confirm</button>
      </div>

    </div>`;

    document.body.append(div);

    document.onclick = function (e) {
        if (e.target == div) {
            div.remove();
            document.onclick = null;
        }
    }

    div.querySelector('#close-confirm-delete-modal').addEventListener('click', function () {
        div.remove();
        document.onclick = null;
    });
    div.querySelector("#confirm-delete-btn").addEventListener('click', function () {
        // target.parentElement.remove();
        showSuccessMessage(2, `All tasks in "${listName}" list have been deleted`);
        for (let item of list.children) {
            item.classList.add("animate-deleted-card");
            setTimeout(() => {
                item.remove();
    
                updateStatistiques();
            }, 750);
        }
        div.remove();
        document.onclick = null;
    });
}

////////////////////////////////////////
/// Get data from localStorage
////////////////////////////////////////

let localStorageContent = localStorage.getItem("todo");

if (localStorageContent) {

    let monthNames = ["Jan", "Fev", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currentDate = new Date();

    let tasksList = localStorageContent.split('-;-');
    tasksList.pop();


    for (let taskItem of tasksList) {
        let taskData = taskItem.split("||");
        let item = {
            id: taskData[0],
            title: taskData[1],
            description: taskData[2],
            priority: taskData[3],
            dueDate: taskData[4],
            list: taskData[5],
        }
        addTaskToList(monthNames, currentDate, item);
    }

}

updateStatistiques();

////////////////////////////////////////
/// Add Tasks
////////////////////////////////////////

closeAddModalBtn.addEventListener('click', closeModalAdd);

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
    let count = addTasksArray.length;
    for (let i = 0; i < count; i++) {
        addAnotherTaskBtn.previousElementSibling.remove();
        addTasksArray.pop();
    }
    addAnotherTaskBtn.removeAttribute('disabled');
    addTaskTitle.value = "";
    addTaskTitle.classList.remove("placeholder:text-red-500");
    addTaskDescription.value = "";
    addPriority.value = "Select";
    addPriority.style.borderColor = "";
    addDueDate.value = "";
    addDueDate.style.borderColor = "";
    addToList.value = "Select";
    addToList.style.borderColor = "";
}

function closeModalOutside(e) {
    if (e.target == taskAddingModal) {
        closeModalAdd();
        window.removeEventListener('click', closeModalOutside);
    }
}

window.addEventListener('click', closeModalOutside);

addAnotherTaskBtn.addEventListener('click', function () {

    if (this.hasAttribute("disabled")) {
        return;
    }

    let errorExist = false;

    if (addTaskTitle.value.trim().length < 1) {
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
        let selectedDueDate = new Date(addDueDate.value);
        let currentDate = new Date();

        let differenceInMs = selectedDueDate.getTime() - currentDate.getTime();

        if (differenceInMs <= 0) {
            addDueDate.style.borderColor = "red";
            errorExist = true;
        } else {
            addDueDate.style.borderColor = "";
        }

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
        if (addPriority.value == "Low") {
            button.classList.add("bg-lime-500");
        } else if (addPriority.value == "Medium") {
            button.classList.add("bg-yellow-500");
        } else {
            button.classList.add("bg-red-500");
        }
        
        addTasksArray.push({id: new Date().getTime(), title: addTaskTitle.value, description: addTaskDescription.value, priority: addPriority.value, dueDate: addDueDate.value, list: addToList.value});
        
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
    
    let currentDate = new Date();

    if (!localStorage.getItem("todo")) {
        localStorage.setItem("todo", "");
    }

    for (const item of addTasksArray) {
        addTaskToList(monthNames, currentDate, item);

        // Add to local Storage
        localStorage.setItem("todo", `${localStorage.getItem("todo")}${item.id}||${item.title}||${item.description}||${item.priority}||${item.dueDate}||${item.list}-;-`);

        showSuccessMessage(1, `${addTasksArray.length} Task(s) Added successfully`);

        updateStatistiques();
    }
    taskAddingModal.classList.remove("flex");
    taskAddingModal.classList.add("hidden");
    clearData();
});

function attachTaskToList(list, task) {
    if (list.firstElementChild.tagName == "P") {
        list.innerHTML = "";
        list.append(task);
    } else {
        list.firstElementChild.before(task);
    }
}

function addTaskToList(monthNames, currentDate, item) {
    const task = document.createElement('div');
    task.setAttribute("draggable", "true");
    task.role = "button";
    task.className = `animate-added-card border-l-4 ${item.priority == "Low" ? "border-lime-500" : (item.priority == "Medium" ? "border-yellow-500" : "border-red-500")} shadow bg-white px-3 pt-2 pb-4 flex justify-between items-center mb-4 hover:bg-slate-200 transition-colors`;

    let datetime = item.dueDate.split("T");

    dateParts = datetime[0].split("-");

    let selectedDueDate = new Date(item.dueDate);

    task.dataset.id = item.id;

    let differenceInMs = selectedDueDate.getTime() - currentDate.getTime();

    let dateStr;

    if (differenceInMs < 86400000) {        // 1000 (ms) * 60 (s) * 60 (min) * 24 (h)
        dateStr = `Today - ${datetime[1]}`;
    } else if (differenceInMs < 172800000) {        // 1000 (ms) * 60 (s) * 60 (min) * 24 (h) * 2
        dateStr = `Tomorrow - ${datetime[1]}`;
    } else {
        dateStr = `${dateParts[2]} ${monthNames[+dateParts[1] - 1]} ${dateParts[0]} - ${datetime[1]}`;
    }

    task.dataset.datetime = item.dueDate;

    task.innerHTML = 
    `<div class="w-11/12">
        <h3 class="mb-1 font-semibold">${item.title}</h3>
        <p class="pe-3 text-ellipsis overflow-hidden text-nowrap text-gray-500 mb-2">${item.description}</p>
        <div class="flex">
            <span class="${item.priority == "Low" ? "bg-lime-500" : (item.priority == "Medium" ? "bg-yellow-500" : "bg-red-500")} text-gray-100 text-xs font-medium me-2 px-4 py-1 rounded-md task-priority">${item.priority}</span>
            <span class="${dateStr.startsWith("Today") || dateStr.startsWith("Tomorrow") ? "bg-red-200 border-red-300" : "bg-gray-50"} text-dark-500 border text-xs font-medium me-2 px-4 py-1 rounded-md inline-flex task-due-date relative overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" height="15" class="me-2 inline-block"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path d="M128 0c13.3 0 24 10.7 24 24l0 40 144 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 40 0c35.3 0 64 28.7 64 64l0 16 0 48 0 256c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 192l0-48 0-16C0 92.7 28.7 64 64 64l40 0 0-40c0-13.3 10.7-24 24-24zM400 192L48 192l0 256c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-256zM329 297L217 409c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 95-95c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
                </svg>
                <span class="task-duedate">${dateStr}</span>
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

    task.querySelector('.task-due-date').addEventListener('mouseenter', function () {
        let seconds = Math.floor((new Date(task.dataset.datetime).getTime() - new Date().getTime()) / 1000);

        let div = document.createElement('div');

        div.className = "w-full absolute top-0 left-0 bg-white text-center h-full flex items-center justify-center";

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        div.textContent = `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;

        seconds--;

        this.appendChild(div);

        const countdown = setInterval(() => {
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;

            div.textContent = `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;

            if (seconds <= 0) {
                clearInterval(countdown);
            }

            seconds--;
        }, 1000);

        task.querySelector('.task-due-date').onmouseleave = function () {
            div.remove();
            clearInterval(countdown)
        }
    });

    task.addEventListener('click', openModifyModal);

    dragTasks(task);

    if (item.list == "ToDo") {
        attachTaskToList(todoListBody, task);
    } else if (item.list == "Doing") {
        attachTaskToList(doingListBody, task);
    } else {
        attachTaskToList(doneListBody, task);
    }

    setTimeout(() => {
        task.classList.remove("animate-added-card");
    }, 750);
}

//////////////////////////////////////
/// Delete Task
//////////////////////////////////////


// document.querySelectorAll('.delete-task').forEach((item) => {
//     item.addEventListener('click', function() {
//         showConfirmModal(item);
//     });
// });

function showConfirmModal(target) {
    const div = document.createElement('div');
    div.id = "confirm-delete-modal";
    div.className = "flex w-full px-3 h-screen fixed top-0 left-0 bg-opacity-60 bg-gray-900 justify-center items-center";
    div.innerHTML = `
    <div class="bg-white rounded-xl w-full max-w-xl h-72 shadow-lg border border-gray-500 flex flex-col justify-between">
      
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
        showSuccessMessage(2, `Task "${target.parentElement.querySelector('h3').textContent.trim()}" has been deleted`);
        target.parentElement.classList.add("animate-deleted-card");


        // Remove from localStorage
        let localStorageContent = localStorage.getItem("todo");

        if (localStorageContent) {
            localStorage.setItem("todo", localStorageContent.replace(new RegExp(`${target.parentElement.dataset.id}.+?-;-`), ''));
        }

        setTimeout(() => {
            target.parentElement.remove();

            updateStatistiques();
        }, 750);
        div.remove();
        
    });
}

function closeConfirmModal(e, el) {
    if (e.target == el) {
        el.remove();
        window.addEventListener('click', function() {
            closeConfirmModal(e, div);
        });
    }
}

///////////////////////////////////////////////
/// Filter Tasks
///////////////////////////////////////////////


filterClearBtn.addEventListener('click', function(e) {
    e.preventDefault();
    searchInput.value = "";
    filterPriority.value = "";
    filterDueDate.value = "";
    filterTasks();
})

filterPriority.addEventListener("change", function () {
    filterTasks();
});

searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    filterTasks();
});

filterDueDate.addEventListener("change", filterTasks);

function filterTasks() {
    const tasksInTodo = todoListBody.children;
    const tasksInDoing = doingListBody.children;
    const tasksInDone = doneListBody.children;
    
    for (task of tasksInDoing) {
        checkTaskFilter(task);
    }
    for (task of tasksInTodo) {
        checkTaskFilter(task);
    }
    for (task of tasksInDone) {
        checkTaskFilter(task);
    }
}

function checkTaskFilter(task) {
    try {
        if (task.querySelector("h3").textContent.search(searchInput.value) >= 0 && task.querySelector(".task-priority").textContent.search(filterPriority.value) >= 0) {
            
            if (filterDueDate.value == "") {
                task.classList.remove('hidden');
            } else if (filterDueDate.value == "Today" && task.querySelector(".task-due-date").textContent.trim().startsWith("Today")) {
                task.classList.remove('hidden');
            } else if (filterDueDate.value == "Tomorrow" && task.querySelector(".task-due-date").textContent.trim().startsWith("Tomorrow")) {
                task.classList.remove('hidden');
            } else {

                let currentDate = new Date();
            
                let selectedDueDate = new Date(task.dataset.datetime);
        
                let differenceInMs = selectedDueDate.getTime() - currentDate.getTime();

                if (filterDueDate.value == "Week" && differenceInMs < 604800000) {
                    task.classList.remove('hidden');
                } else if (filterDueDate.value == "Month" && differenceInMs < 2592000000) {
                    task.classList.remove('hidden');
                } else if (filterDueDate.value == "Over-month" && differenceInMs > 2592000000) {
                    task.classList.remove('hidden');
                } else {
                    task.classList.add('hidden');
                }
            }
        } else {
            task.classList.add('hidden');
        }
    } catch {

    }
}

/////////////////////////////////////////
/// Modify Task
/////////////////////////////////////////

let modifyTask = null;

// Apply event to all tasks

for (let item of todoListBody.children) {
    item.addEventListener('click', openModifyModal);
}
for (let item of doingListBody.children) {
    item.addEventListener('click', openModifyModal);
}
for (let item of doneListBody.children) {
    item.addEventListener('click', openModifyModal);
}

// Change Task Status

function changeTaskStatus(listBody, modifyTask) {
    if (listBody.firstElementChild.tagName != "DIV") {
        listBody.innerHTML = "";
        listBody.append(modifyTask);
    } else {
        listBody.firstElementChild.before(modifyTask);
    }
    updateStatistiques();
}

// Function to open Modify Button

function openModifyModal(e) {
    const button = this.querySelector('button');

    if (button && (e.target === button || button.contains(e.target))) {
        return;
    }

    taskModifyingModal.classList.remove("hidden");
    taskModifyingModal.classList.add("flex");

    modifyTaskTitle.value = this.querySelector("h3").textContent;
    modifyTaskDescription.value = this.querySelector("p").textContent;
    modifyPriority.value = this.querySelector(".task-priority").textContent;
    modifyDueDate.value = this.dataset.datetime;
    modifyToList.value = this.parentElement.dataset.list;

    modifyTask = this;
}

// Close Modify Modal

closeModifyModal.addEventListener('click', function () {
    taskModifyingModal.classList.add('hidden');
    taskModifyingModal.classList.add('flex');
});

// Add Click Event to save Button

saveModifyBtn.addEventListener("click", applyModifications);

// Validate and apply modifications

function applyModifications() {
    const priority = modifyTask.querySelector(".task-priority");

    let error = false;
    let currentDate = new Date();
    let monthNames = ["Jan", "Fev", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (modifyTaskTitle.value.trim() == "") {
        modifyTaskTitle.classList.add("placeholder:text-red-500");
        error = true;
    } else {
        modifyTaskTitle.classList.remove("placeholder:text-red-500");
    }

    if (modifyDueDate.value == "") {
        modifyDueDate.style.borderColor = "red";
        error = true;
    } else {
        let selectedDueDate = new Date(modifyDueDate.value);

        let differenceInMs = selectedDueDate.getTime() - currentDate.getTime();

        if (differenceInMs <= 0) {
            modifyDueDate.style.borderColor = "red";
            error = true;
        } else {
            modifyDueDate.style.borderColor = "";
        }
    }
        

    if (error == true) {
        return;
    }
    
    modifyTask.querySelector("h3").textContent = modifyTaskTitle.value;
    modifyTask.querySelector("p").textContent = modifyTaskDescription.value;

    // Change Due Date

    let datetime = modifyDueDate.value.split("T");

    dateParts = datetime[0].split("-");

    let selectedDueDate = new Date(modifyDueDate.value);

    let differenceInMs = selectedDueDate.getTime() - currentDate.getTime();

    let dateStr;

    if (differenceInMs < 86400000) {        // 1000 (ms) * 60 (s) * 60 (min) * 24 (h)
        dateStr = `Today - ${datetime[1]}`;
        modifyTask.querySelector('.task-due-date').classList.add('bg-red-200', 'border-red-300');
    } else if (differenceInMs < 172800000) {        // 1000 (ms) * 60 (s) * 60 (min) * 24 (h) * 2
        dateStr = `Tomorrow - ${datetime[1]}`;
        modifyTask.querySelector('.task-due-date').classList.add('bg-red-200', 'border-red-300');
    } else {
        dateStr = `${dateParts[2]} ${monthNames[+dateParts[1] - 1]} ${dateParts[0]} - ${datetime[1]}`;
        modifyTask.querySelector('.task-due-date').classList.remove('bg-red-200', 'border-red-300');
    }
    modifyTask.querySelector('.task-duedate').textContent = dateStr;
    modifyTask.dataset.datetime = modifyDueDate.value;


    // Change Priority

    priority.textContent = modifyPriority.value;
    priority.classList.remove('bg-red-500');
    priority.classList.remove('bg-lime-500');
    priority.classList.remove('bg-yellow-500');
    modifyTask.classList.remove('border-red-500');
    modifyTask.classList.remove('border-lime-500');
    modifyTask.classList.remove('border-yellow-500');
    if (modifyPriority.value == "Low") {
        priority.classList.add('bg-lime-500');
        modifyTask.classList.add("border-lime-500");
    } else if (modifyPriority.value == "Medium") {
        priority.classList.add('bg-yellow-500');
        modifyTask.classList.add("border-yellow-500");
    } else {
        priority.classList.add('bg-red-500');
        modifyTask.classList.add("border-red-500");
    }

    // Change List

    if (modifyToList.value == "ToDo") {
        changeTaskStatus(todoListBody, modifyTask);
    } else if (modifyToList.value == "Doing") {
        changeTaskStatus(doingListBody, modifyTask);
    } else {
        changeTaskStatus(doneListBody, modifyTask);
    }

    // Update localStorage
    let localStorageContent = localStorage.getItem("todo");

    if (localStorageContent) {
        let newValue = `${modifyTask.dataset.id}||${modifyTaskTitle.value}||${modifyTaskDescription.value}||${modifyPriority.value}||${modifyDueDate.value}||${modifyToList.value}-;-`;
        localStorage.setItem("todo", localStorageContent.replace(new RegExp(`${modifyTask.dataset.id}.+?-;-`), newValue));
    }
 
    // Hide Modal

    taskModifyingModal.classList.remove("flex");
    taskModifyingModal.classList.add("hidden");

    // modifyToList.value = item.parentElement.dataset.list;
    modifyTask = null;

    showSuccessMessage(3, `Task "${modifyTaskTitle.value}" has been modified`);
}

/////////////////////////////////////////////
/// Drag and Drop
/////////////////////////////////////////////

let draggedItem = null;

for (let item of doingListBody.children) {
    dragTasks(item);
}
for (let item of todoListBody.children) {
    dragTasks(item);
}

function dragTasks(item) {
    item.addEventListener("dragstart", function () {
        draggedItem = item;
        item.classList.add("animated-drag", "opacity-70", "border-2", "border-blue-500", "border-dashed", "blur-[1px]");
        item.classList.remove("hover:bg-slate-200", "border-l-4");
    });
    
    item.addEventListener("dragend", function (e) {
        item.classList.remove("animated-drag", "opacity-70", "border-2", "border-blue-500", "border-dashed", "blur-[1px]");
        item.classList.add("hover:bg-slate-200", "border-l-4");
    });
}

// Drag and Drop: Done List

doneListBody.addEventListener("dragover", function (e) {
    this.classList.add("border", "border-blue-500");
    this.classList.remove("border-gray-300");
    e.preventDefault();
});

doneListBody.addEventListener("dragleave", function (e) {
    doneListBody.classList.remove("border", "border-blue-500");
    doneListBody.classList.add("border-gray-300");
});

doneListBody.addEventListener("drop", function (e) {
    dropTaskInList(e, doneListBody, "Done");
});


// Drag and Drop: Doing List

doingListBody.addEventListener("dragover", function (e) {
    this.classList.add("border", "border-blue-500");
    this.classList.remove("border-gray-300");
    e.preventDefault();
});

doingListBody.addEventListener("dragleave", function (e) {
    doingListBody.classList.remove("border", "border-blue-500");
    doingListBody.classList.add("border-gray-300");
});

doingListBody.addEventListener("drop", function (e) {
    dropTaskInList(e, doingListBody, "Doing");
});

// Drag and Drop: To Do List

todoListBody.addEventListener("dragover", function (e) {
    this.classList.add("border", "border-blue-500");
    this.classList.remove("border-gray-300");
    e.preventDefault();
});

todoListBody.addEventListener("dragleave", function (e) {
    todoListBody.classList.remove("border", "border-blue-500");
    todoListBody.classList.add("border-gray-300");
});

todoListBody.addEventListener("drop", function (e) {
    dropTaskInList(e, todoListBody, "ToDo");
});

function dropTaskInList(e, list, listName) {
    list.classList.remove("border", "border-blue-500");
    list.classList.add("border-gray-300");
    showSuccessMessage(3, `Task "${draggedItem.querySelector('h3').textContent.trim()}" moved to "Done"`);

    // Update localStorage
    let localStorageContent = localStorage.getItem("todo");

    if (localStorageContent) {
        let newValue = `${draggedItem.dataset.id}||${draggedItem.querySelector('h3').textContent}||${draggedItem.querySelector('p').textContent}||${draggedItem.querySelector('.task-priority').textContent}||${draggedItem.dataset.datetime}||${listName}-;-`;
        console.log(newValue)
        console.log(localStorage)
        localStorage.setItem("todo", localStorageContent.replace(new RegExp(`${draggedItem.dataset.id}.+?-;-`), newValue));
    }
    
    if (list.firstElementChild.tagName != "DIV") {
        list.innerHTML = "";
        draggedItem.classList.add("animate-dragged-card");
        draggedItem.classList.remove("animate-dropped-card");

        setTimeout(() => {
            list.append(draggedItem);
            draggedItem.classList.remove("animate-dragged-card");
            draggedItem.classList.add("animate-dropped-card");
            updateStatistiques();
        }, 500);
    } else {
        draggedItem.classList.add("animate-dragged-card");
        draggedItem.classList.remove("animate-dropped-card");
        setTimeout(() => {
            list.firstElementChild.before(draggedItem);
            draggedItem.classList.remove("animate-dragged-card");
            draggedItem.classList.add("animate-dropped-card");
            updateStatistiques();
        }, 500);
    }
    setTimeout(() => {
        draggedItem.classList.remove("animate-dropped-card");
        draggedItem = null;
    }, 1000)
}

////////////////////////////////////////
/// Update Statistics
////////////////////////////////////////

function updateStatistiques() {
    
    if (todoListBody.childElementCount == 0 || todoListBody.firstElementChild.tagName == 'P') {
        todoTotalTasks.textContent = 0;
        todoListBody.innerHTML = `<p class="text-center text-gray-500 pt-6 px-7">This list is empty, add or move a card here to be shown.</p>`;
    } else {
        todoTotalTasks.textContent = todoListBody.childElementCount;
    }

    if (doingListBody.childElementCount == 0 || doingListBody.firstElementChild.tagName == 'P') {
        doingTotalTasks.textContent = 0;
        doingListBody.innerHTML = `<p class="text-center text-gray-500 pt-6 px-7">This list is empty, add or move a card here to be shown.</p>`;
    } else {
        doingTotalTasks.textContent = doingListBody.childElementCount;
    }

    if (doneListBody.childElementCount == 0 || doneListBody.firstElementChild.tagName == 'P') {
        doneTotalTasks.textContent = 0;
        doneListBody.innerHTML = `<p class="text-center text-gray-500 pt-6 px-7">This list is empty, add or move a card here to be shown.</p>`;
    } else {
        doneTotalTasks.textContent = doneListBody.childElementCount;
    }

}

/////////////////////////////////////
/// Show Success Message
/////////////////////////////////////

function showSuccessMessage(icon, message) {
    let msgEl = document.createElement('div');
    let iconSVG = "";

    msgEl.className = "animated-message flex items-center fixed top-0 opacity-0 left-1/2 -translate-y-full -translate-x-1/2 w-full max-w-md p-4 mb-4 text-white bg-gray-700 rounded-lg shadow-gray-500 shadow-md";

    if (icon == 1) {
        iconSVG = 
            `<svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>`;
    } else if (icon == 2) {
        iconSVG = 
            `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>`;
    } else if (icon == 3) {
        iconSVG = 
            `<svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM325.8 139.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-21.4 21.4-71-71 21.4-21.4c15.6-15.6 40.9-15.6 56.6 0zM119.9 289L225.1 183.8l71 71L190.9 359.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>`
    }

    msgEl.innerHTML = 
        `<div class="inline-flex items-center justify-center w-8 h-8 text-${icon == 1 ? 'green' : (icon == 2 ? "red" : "blue")}-500 rounded-lg">
            ${iconSVG}
        </div>
        <div class="ms-3 text-sm font-bold">${message}</div>`;

    document.body.append(msgEl);

    setTimeout(() => {
        msgEl.remove();
    }, 5000);
}

document.querySelectorAll('.add-task-btn').forEach(item => {
    item.addEventListener('click', function () {
        taskAddingModal.classList.add('flex');
        taskAddingModal.classList.remove('hidden');

        taskAddingModal.querySelector('#add-to-list').value = this.dataset.list;
        window.addEventListener('click', closeModalOutside);
    });
});