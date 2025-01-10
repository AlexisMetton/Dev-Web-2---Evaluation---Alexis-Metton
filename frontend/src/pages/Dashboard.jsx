import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";
import API_URL from "@/utils/ConfiAPI";

const Dashboard = () => {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [error, setError] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortOption, setSortOption] = useState("date-desc");

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    sortTasks(e.target.value);
  };

  const sortTasks = (option) => {
    let sortedTasks = [...tasks];
    if (option === "date-asc") {
      sortedTasks.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    } else if (option === "date-desc") {
      sortedTasks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (option === "status") {
      sortedTasks.sort((a, b) => a.completed - b.completed);
    }
    setTasks(sortedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        let sortedTasks = [...data.tasks];
        if (sortOption === "date-asc") {
          sortedTasks.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        } else if (sortOption === "date-desc") {
          sortedTasks.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        } else if (sortOption === "status") {
          sortedTasks.sort((a, b) => a.completed - b.completed);
        }
  
        setTasks(sortedTasks);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de la récupération des tâches.");
    }
  };

  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prevTasks) => [...prevTasks, data.task]);
        setNewTask({ title: "", description: "" });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de la tâche.");
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
      fetchTasks();
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche.");
    }
  };

  const handleEditTaskChange = (e) => {
    setTaskToEdit({ ...taskToEdit, [e.target.name]: e.target.value });
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!taskToEdit) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskToEdit),
      });
      fetchTasks();
      closeEditModal();
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche.");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );
      setShowModal(false);
      setTaskToDelete(null);
    } catch (err) {
      setError("Erreur lors de la suppression de la tâche.");
      setShowModal(false);
    }
  };

  const openModal = (task) => {
    setTaskToDelete(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTaskToDelete(null);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setTaskToEdit(null);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mt-6 mb-6">Mes Tâches</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="mb-4 flex justify-center">
        <div className="w-[280px]">
          <label
            htmlFor="sort"
            className="block text-sm font-medium mb-1 text-center"
          >
            Trier par :
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className={`block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          >
            <option value="date-desc">Date (Descendant)</option>
            <option value="date-asc">Date (Ascendant)</option>
            <option value="status">Statut de complétion</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-6">
        <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border h-fit ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 hover:border-green-400"
                  : "bg-gray-50 border-gray-200 hover:border-green-500"
              } transition-colors duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 ">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={task.completed}
                    onChange={(e) =>
                      handleUpdateTask(task.id, {
                        title: task.title,
                        description: task.description,
                        completed: e.target.checked,
                      })
                    }
                  />
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold break-words text-left ${
                        task.completed
                          ? "line-through text-red-500"
                          : theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p
                      className={`mt-1 text-left break-words ${
                        task.completed
                          ? "line-through"
                          : theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    onClick={() => openEditModal(task)}
                    className={`px-3 py-2 ${
                      theme === "dark" ? "fill-black" : "fill-white"
                    }`}
                  >
                    <svg viewBox="0 0 512 512" style={{ height: "1em" }}>
                      <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                    </svg>
                  </Button>
                  <button
                    onClick={() => openModal(task)}
                    className="px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg
                      viewBox="0 0 448 512"
                      style={{ height: "1em", fill: "white" }}
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={`lg:w-1/2 p-4 rounded-lg shadow-md sticky top-28 h-fit ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">Ajouter une nouvelle tâche</h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Titre
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleTaskChange}
                required
                className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleTaskChange}
                required
                className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                  theme === "dark"
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                rows="3"
              ></textarea>
            </div>
            <Button
              type="submit"
              className={`w-full ${
                theme === "dark" ? "text-black" : "text-white"
              }`}
            >
              Ajouter la tâche
            </Button>
          </form>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={handleDeleteTask}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer
              </Button>
              <Button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className={`bg-white rounded-lg shadow-lg p-6 w-1/3 ${
              theme === "dark" ? "bg-gray-800 text-white" : ""
            }`}
          >
            <h3 className="text-xl font-bold mb-4">Modifier la tâche</h3>
            <form onSubmit={handleEditTask} className="space-y-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Titre
                </label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={taskToEdit?.title || ""}
                  onChange={handleEditTaskChange}
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-description"
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={taskToEdit?.description || ""}
                  onChange={handleEditTaskChange}
                  required
                  className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }`}
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Enregistrer
                </Button>
                <Button
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
