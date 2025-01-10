import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";
import API_URL from "@/utils/ConfiAPI";
import Modal from "@/components/modal/Modal";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import TaskForm from "@/components/taskForm/TaskForm";
import UserForm from "@/components/userForm/UserForm";
import UserItem from "@/components/userItem/UserItem";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    roles: "ROLE_USER",
  });
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de la récupération des utilisateurs.");
    }
  };

  const handleAddUser = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        fetchUsers();
        setNewUser({ username: "", email: "", password: "", roles: "ROLE_USER" });
      } else {
        setError(responseData.error || "Erreur lors de l'ajout de l'utilisateur.");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de l'utilisateur.");
    }
  };

  const handleEditUser = async (data) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/admin/user/${userToEdit.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            fetchUsers();
            closeEditModal();
        } else {
            const responseData = await response.json();
            setError(responseData.error || "Erreur lors de la mise à jour.");
        }
    } catch (err) {
        setError("Erreur lors de la mise à jour de l'utilisateur.");
    }
};

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/admin/user/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
      setShowModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur.");
      setShowModal(false);
    }
  };

  const openModal = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setUserToEdit(null);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mt-6 mb-6">Gestion des Utilisateurs</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 px-6">
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 750: 1, 751: 2 }}
          className="lg:w-2/3"
        >
            <Masonry gutter="16px">
    {users.map((user) => (
      <UserItem
        key={user.id}
        user={user}
        theme={theme}
        onEdit={() => openEditModal(user)}
        onDelete={() => openModal(user)}
      />
    ))}
  </Masonry>
        </ResponsiveMasonry>

        <div
          className={`lg:w-1/3 p-4 rounded-lg shadow-md sticky top-28 h-fit ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">Ajouter un utilisateur</h3>
          <UserForm
            defaultValues={newUser}
            onSubmit={handleAddUser}
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
            onClick: handleDeleteUser,
            className: "bg-red-600 hover:bg-red-700 text-white",
          },
        ]}
      >
        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
      </Modal>

      <Modal
        show={showEditModal}
        onClose={closeEditModal}
        title="Modifier les rôles"
        theme={theme}
      >
        <UserForm
          defaultValues={userToEdit}
          onSubmit={handleEditUser}
          theme={theme}
        />
      </Modal>
    </>
  );
};

export default AdminDashboard;
