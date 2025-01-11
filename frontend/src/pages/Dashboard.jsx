import { useState, useEffect } from "react";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";
import API_URL from "@/utils/ConfiAPI";
import TaskForm from "@/components/taskForm/TaskForm";
import TaskItem from "@/components/taskItem/TaskItem";
import Modal from "@/components/modal/Modal";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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
      sortedTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed - b.completed;
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });
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
      // Obligé de faire le tri directement ici car si j'appelle sortTasks alors ce n'est plus dynamique
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
          sortedTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
              return a.completed - b.completed;
            }
            return new Date(b.created_at) - new Date(a.created_at);
          });
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

  const handleAddTask = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        fetchTasks();
      } else {
        setError(responseData.error || "Erreur lors de l'ajout de la tâche.");
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

  const handleEditTask = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/tasks/${taskToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
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
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 750: 1, 751: 2 }}
          className="lg:w-2/3"
        >
          <Masonry gutter="16px">
            {" "}
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                theme={theme}
                onEdit={() => openEditModal(task)}
                onDelete={() => openModal(task)}
                onToggle={() =>
                  handleUpdateTask(task.id, {
                    ...task,
                    completed: !task.completed,
                  })
                }
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
        <div
          className={`lg:w-1/3 p-4 rounded-lg shadow-md sticky top-28 h-fit ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">Ajouter une nouvelle tâche</h3>
          <TaskForm
            newTask={newTask}
            onTaskChange={handleTaskChange}
            onSubmit={handleAddTask}
            theme={theme}
          />
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={closeModal}
        title="Confirmer la suppression"
        theme={theme}
        actions={[
          {
            label: "Supprimer",
            onClick: handleDeleteTask,
            className: "bg-red-600 hover:bg-red-700 text-white",
          },
        ]}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est
          irréversible.
        </p>
      </Modal>
      <Modal
        show={showEditModal}
        onClose={closeEditModal}
        title="Modifier la tâche"
        theme={theme}
      >
        <TaskForm
          defaultValues={taskToEdit}
          onSubmit={handleEditTask}
          theme={theme}
        />
      </Modal>
    </>
  );
};

export default Dashboard;
