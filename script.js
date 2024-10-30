const addTaskBtn = document.querySelector('#add-task');
const taskAddingModal = document.querySelector('#tasks-adding-modal');
const closeModalBtn = document.querySelector('#close-modal');
const todoListBody = document.querySelector('.todo-list-body');
const doingListBody = document.querySelector('.doing-list-body');
const doneListBody = document.querySelector('.done-list-body');

addTaskBtn.addEventListener('click', function () {
    taskAddingModal.classList.remove('hidden');
    taskAddingModal.classList.add('flex');
    window.addEventListener('click', closeModalOutside);
});

closeModalBtn.addEventListener('click', function () {
    taskAddingModal.classList.add('hidden');
    taskAddingModal.classList.remove('flex');
});


function closeModalOutside(e) {
    if (e.target == taskAddingModal) {
        taskAddingModal.classList.add('hidden');
        taskAddingModal.classList.remove('flex');
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
        target.parentElement.remove();
        div.remove();

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