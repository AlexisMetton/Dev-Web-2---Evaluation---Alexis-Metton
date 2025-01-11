import { useState, useEffect } from "react";
import API_URL from "@/utils/ConfiAPI";
import { Button } from "../ui/button";
import TaskForm from "../taskForm/TaskForm";

const TaskManagerModal = ({ user, onClose, theme }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/tasks/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks);
      } else {
        setError("Erreur lors de la récupération des tâches.");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des tâches.");
    }
  };

  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/tasks/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchTasks();
        setShowAddForm(false);
        setError("");
      } else {
        setError(data.error || "Erreur lors de l'ajout de la tâche.");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de la tâche.");
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchTasks();
        setEditingTask(null);
        setError("");
      } else {
        setError(data.error || "Erreur lors de la mise à jour de la tâche.");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/admin/tasks/${user.id}/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchTasks();
      } else {
        setError("Erreur lors de la suppression de la tâche.");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de la tâche.");
    }
  };

  const handleToggleCompleted = async (taskId, currentState) => {
    try {
      // Trouver la tâche à partir de la liste des tâches
      const task = tasks.find((t) => t.id === taskId);

      if (!task) {
        setError("Tâche introuvable.");
        return;
      }

      await updateTask(taskId, {
        title: task.title,
        description: task.description,
        completed: !currentState,
      });
    } catch {
      setError("Erreur lors de la mise à jour de l'état de complétion.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[80vw] max-w-[1000px] max-w-screen-lg relative">
        <h2 className="text-lg font-bold mb-4">
          Gérer les tâches de {user.username}
        </h2>
        {error && <div className="text-sm text-red-500 mb-4">{error}</div>}

        {/* Tableau des tâches */}
        <div
          className="max-h-64 overflow-y-auto mb-4 border-t border-b"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="min-w-full table-fixed border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left w-16">ID</th>
                <th className="px-4 py-2 text-left truncate">Titre</th>
                <th className="px-4 py-2 text-left truncate">Description</th>
                <th className="px-4 py-2 text-left truncate">Complété ?</th>
                <th className="px-4 py-2 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2 text-left">{task.id}</td>
                  <td className="px-4 py-2 truncate text-left overflow-hidden max-w-[20vw]">
                    {task.title}
                  </td>
                  <td className="px-4 py-2 truncate text-left overflow-hidden max-w-[20vw]">
                    {task.description}
                  </td>
                  <td className="px-4 py-2 truncate text-left overflow-hidden max-w-[20vw]">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        handleToggleCompleted(task.id, task.completed)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 text-center space-x-2 flex">
                    <Button
                      onClick={() => {
                        setEditingTask(task);
                        setShowAddForm(false);
                      }}
                      className={`px-3 py-2 ${
                        theme === "dark" ? "fill-black" : "fill-white"
                      }`}
                    >
                      <svg viewBox="0 0 512 512" style={{ height: "1em" }}>
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                      </svg>
                    </Button>
                    <Button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <svg
                        viewBox="0 0 448 512"
                        style={{ height: "1em", fill: "white" }}
                      >
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulaires d'ajout et de modification */}
        <div className="mt-4">
          {editingTask ? (
            <TaskForm
              defaultValues={editingTask}
              onSubmit={(updatedData) =>
                updateTask(editingTask.id, updatedData)
              }
              theme={theme}
            />
          ) : showAddForm ? (
            <TaskForm
              newTask={{ title: "", description: "" }}
              onSubmit={addTask}
              theme={theme}
            />
          ) : null}
        </div>

        {/* Boutons Ajouter/Annuler et Fermer */}
        <div className="flex gap-6">
          <Button
            onClick={() => {
              if (editingTask) {
                setEditingTask(null); // Réinitialiser la modification
              } else {
                setShowAddForm(!showAddForm); // Alterner l'état d'ajout
              }
            }}
            className={`w-full mt-4 ${
              editingTask || showAddForm ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {editingTask || showAddForm ? "Annuler" : "Ajouter une tâche"}
          </Button>
          <Button
            onClick={onClose}
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md w-full sticky bottom-0"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskManagerModal;
