const addTaskBtn = document.querySelector('#add-task');
const taskAddingModal = document.querySelector('#tasks-adding-modal');
const closeModalBtn = document.querySelector('#close-modal');

addTaskBtn.addEventListener('click', function () {
    taskAddingModal.classList.remove('hidden');
    taskAddingModal.classList.add('flex');
});

closeModalBtn.addEventListener('click', function () {
    taskAddingModal.classList.add('hidden');
    taskAddingModal.classList.remove('flex');
});