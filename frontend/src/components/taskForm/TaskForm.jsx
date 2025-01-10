import { useForm } from "react-hook-form";
import CustomInput from "@/components/customInput/CustomInput";
import { Button } from "@/components/ui/button";
import CustomTextarea from "../customTextarea/CustomTextarea";

const TaskForm = ({ defaultValues, onSubmit, theme }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <CustomInput
        type="text"
        name="title"
        label="Titre"
        errorMessage={errors.title?.message}
        {...register("title", {
          required: "Le titre est obligatoire",
          minLength: {
            value: 3,
            message: "Le titre doit contenir au moins 3 caractères",
          },
        })}
      />

      <CustomTextarea
        name="description"
        label="Description"
        errorMessage={errors.description?.message}
        rows={5}
        {...register("description", {
          required: "La description est obligatoire",
          minLength: {
            value: 5,
            message: "La description doit contenir au moins 5 caractères",
          },
        })}
      />

      <Button type="submit" className="w-full">
        {defaultValues ? "Modifier la tâche" : "Ajouter la tâche"}
      </Button>
    </form>
  );
};

export default TaskForm;
