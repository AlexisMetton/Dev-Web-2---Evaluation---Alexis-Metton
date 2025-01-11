import { useForm } from "react-hook-form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/ui/button";

const UserForm = ({ defaultValues, onSubmit, theme, currentUserRoles }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...defaultValues,
      password: "",
    },
  });

  const isEditMode = Boolean(defaultValues?.id);

  const handleFormSubmit = async (data) => {
    if (typeof data.roles === "string") {
      try {
        data.roles = JSON.parse(data.roles);
      } catch {
        data.roles = [data.roles];
      }
    }

    data.roles = Array.isArray(data.roles) ? data.roles : [data.roles];

    await onSubmit(data);
    reset();
  };

  const isSuperAdmin = currentUserRoles.includes("ROLE_SUPERADMIN");
  const availableRoles = isSuperAdmin
    ? ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPERADMIN"]
    : ["ROLE_USER"];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <CustomInput
        type="text"
        name="username"
        label="Nom d'utilisateur"
        errorMessage={errors.username?.message}
        {...register("username", {
          required: "Le nom d'utilisateur est obligatoire",
          minLength: {
            value: 3,
            message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
          },
        })}
      />
      <CustomInput
        type="email"
        name="email"
        label="Email"
        errorMessage={errors.email?.message}
        {...register("email", {
          required: "L'email est obligatoire",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "L'email n'est pas valide",
          },
        })}
      />
      <CustomInput
        type="password"
        name="password"
        label={
          isEditMode ? "Nouveau mot de passe (facultatif)" : "Mot de passe"
        }
        errorMessage={errors.password?.message}
        {...register("password", {
          required: !isEditMode ? "Le mot de passe est obligatoire" : false,
          minLength: {
            value: 8,
            message: "Le mot de passe doit contenir au moins 8 caractères",
          },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
          },
        })}
      />
      <div>
        <label
          htmlFor="roles"
          className={`block text-sm font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-900"
          }`}
        >
          Rôles
        </label>
        <select
          id="roles"
          name="roles"
          multiple
          className={`mt-1 block w-full px-3 py-2 rounded-md shadow-sm ${
            theme === "dark"
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black"
          }`}
          {...register("roles", {
            required: "Veuillez sélectionner au moins un rôle",
          })}
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role.replace("ROLE_", "")}
            </option>
          ))}{" "}
        </select>
        {errors.roles && (
          <p className="text-sm text-red-500 mt-1">{errors.roles.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        {isEditMode ? "Modifier l'utilisateur" : "Ajouter l'utilisateur"}
      </Button>
    </form>
  );
};

export default UserForm;
