document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const addTaskBtn = document.querySelector(".btn-add-task");
    const taskModal = document.getElementById("task-modal");
    const closeModalBtn = document.querySelector(".btn-close");
    const saveTaskBtn = document.querySelector(".btn-save");
    const taskTitle = document.getElementById("task-title");
    const taskDesc = document.getElementById("task-desc");
    const taskPriority = document.getElementById("task-priority");
    const taskDue = document.getElementById("task-due");
    const taskContainer = document.getElementById("task-container");
    const filterPriority = document.getElementById("filter-priority");
    const filterStatus = document.getElementById("filter-status");
    const assignMemberDropdown = document.getElementById("assign-member");
    const fileUploadBtn = document.querySelector('.btn-upload');
    const fileInput = document.getElementById('file-upload-input');
    const fileList = document.getElementById('file-list');

    // Example Team Members
    const teamMembers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Alice Brown" }
    ];

    // Add team members to the dropdown
    teamMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        assignMemberDropdown.appendChild(option);
    });

    // Task array to track tasks (for stats and removal)
    let tasks = [];

    // Show task modal
    addTaskBtn.addEventListener("click", () => {
        taskModal.style.display = "flex";
    });

    // Close task modal
    closeModalBtn.addEventListener("click", () => {
        taskModal.style.display = "none";
    });

    // Save task and add it to the task list
    saveTaskBtn.addEventListener("click", () => {
        const title = taskTitle.value.trim();
        const description = taskDesc.value.trim();
        const priority = taskPriority.value;
        const dueDate = taskDue.value;
        const assignedMemberId = assignMemberDropdown.value;

        // Validation for required fields
        if (title === "" || description === "" || !dueDate || !assignedMemberId) {
            alert("Please fill in all fields.");
            return;
        }

        const assignedMember = teamMembers.find(member => member.id == assignedMemberId);

        const task = {
            id: Date.now(),  // Unique ID based on timestamp
            title,
            description,
            priority,
            dueDate,
            assignedMemberId,
            assignedMember: assignedMember.name,
            status: 'pending',  // Default status
        };

        tasks.push(task);  // Add the task to the array

        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        taskItem.dataset.id = task.id;  // Store the task ID for future reference

        taskItem.innerHTML = `
            <div>
                <h3>${title}</h3>
                <p>${description}</p>
                <p><strong>Priority:</strong> <span class="task-priority">${priority}</span></p>
                <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleString()}</p>
                <p><strong>Assigned to:</strong> ${assignedMember.name}</p>
            </div>
            <div class="task-actions">
                <button class="btn-edit">Edit</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;

        taskContainer.appendChild(taskItem);

        // Clear form
        taskTitle.value = "";
        taskDesc.value = "";
        taskPriority.value = "medium";
        taskDue.value = "";
        assignMemberDropdown.value = "";

        taskModal.style.display = "none";

        // Task Delete functionality (using the task ID)
        taskItem.querySelector(".btn-delete").addEventListener("click", () => {
            taskContainer.removeChild(taskItem);
            tasks = tasks.filter(t => t.id !== task.id);  // Remove task from array
            updateTaskStats();  // Update task stats after deletion
        });

        // Task Edit functionality (not implemented here)
        taskItem.querySelector(".btn-edit").addEventListener("click", () => {
            alert('Edit task functionality goes here!');
        });

        updateTaskStats();  // Update task stats after adding a new task
    });

    // Filter tasks by priority and status
    filterPriority.addEventListener("change", filterTasks);
    filterStatus.addEventListener("change", filterTasks);

    function filterTasks() {
        const priority = filterPriority.value;
        const status = filterStatus.value;

        const tasks = document.querySelectorAll(".task-item");
        tasks.forEach(task => {
            const taskPriority = task.querySelector(".task-priority").textContent.toLowerCase();
            const taskStatus = task.querySelector(".task-status") ? task.querySelector(".task-status").textContent.toLowerCase() : "pending";

            const matchesPriority = (priority === "all" || taskPriority.includes(priority));
            const matchesStatus = (status === "all" || taskStatus.includes(status));

            if (matchesPriority && matchesStatus) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        });
    }

    // Handle file upload
    fileUploadBtn.addEventListener('click', function() {
        const file = fileInput.files[0];

        if (file) {
            const fileItem = document.createElement('li');
            fileItem.classList.add('file-item');
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileItem.appendChild(fileName);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                fileList.removeChild(fileItem);
            });
            fileItem.appendChild(deleteBtn);
            
            fileList.appendChild(fileItem);
        }

        // Clear file input after upload
        fileInput.value = '';
    });

    // Example task data (you can replace this with dynamic task data from your server)
    // Function to update task statistics
    function updateTaskStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;

        // Update the HTML elements
        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('pending-tasks').textContent = pendingTasks;
    }

    // Call the function to update stats when the page loads
    updateTaskStats();

    // Toggle Assign Task Modal
    document.querySelector('.btn-assign').addEventListener('click', function () {
        document.getElementById('assignModal').style.display = 'flex';
    });

    // Close Modal
    document.querySelector('.modal-close').addEventListener('click', function () {
        document.getElementById('assignModal').style.display = 'none';
    });

    // Toggle visibility of the statistics panel
    const showStatsBtn = document.getElementById('btn-show-stats');
    const detailedStatsPanel = document.getElementById('detailed-stats');

    showStatsBtn.addEventListener('click', () => {
        if (detailedStatsPanel.style.display === 'none' || !detailedStatsPanel.style.display) {
            detailedStatsPanel.style.display = 'block';
        } else {
            detailedStatsPanel.style.display = 'none';
        }
    });

    // Update stats dynamically based on task data
    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;
        const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length;

        document.getElementById('detailed-total-tasks').querySelector('.stat-value').textContent = totalTasks;
        document.getElementById('detailed-completed-tasks').querySelector('.stat-value').textContent = completedTasks;
        document.getElementById('detailed-pending-tasks').querySelector('.stat-value').textContent = pendingTasks;
        document.getElementById('detailed-overdue-tasks').querySelector('.stat-value').textContent = overdueTasks;
    }

    updateStats(); // Call on page load
});
