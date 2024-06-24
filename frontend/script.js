const taskList = document.getElementById("taskList");
const addTaskForm = document.getElementById("addTaskForm");

function displayTasks() {
  fetch("http://localhost:3000/tasks")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching tasks");
      }
      return response.json();
    })
    .then((tasks) => {
      taskList.innerHTML = "";

      tasks.forEach((task) => {
        const newTaskItem = document.createElement("li");
        newTaskItem.textContent = `${task.time} - ${task.date}: ${task.description}`;
        taskList.appendChild(newTaskItem);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskTime = document.getElementById("taskTime").value;
  const taskDate = document.getElementById("taskDate").value;
  const taskDescription = document.getElementById("taskDescription").value;

  const taskData = {
    time: taskTime,
    date: taskDate,
    description: taskDescription,
  };

  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error adding task");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Task added successfully:", data);
      addTaskForm.reset();
      displayTasks();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Initial display of tasks
displayTasks();
