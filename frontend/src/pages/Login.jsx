import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/customInput/CustomInput";
import { useForm } from "react-hook-form";
import { useAuth } from "@/security/authProvider/AuthProvider";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";
import API_URL from "@/utils/ConfiAPI";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();
  const { theme } = useTheme();

  const onSubmit = async (data) => {
    setServerError(null);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("token", responseData.token);
        const isAuthenticated = await checkAuthStatus();
        if (isAuthenticated) {
          navigate("/dashboard");
        }
      } else {
        setServerError(responseData.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setServerError("Impossible de se connecter. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-md ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Sign in to your account
        </h2>

        {serverError && (
          <div
            id="message_error"
            className="bg-red-500 text-white px-4 py-3 rounded-md"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="rounded-md shadow-sm space-y-4">
            <CustomInput
              type="text"
              name="username"
              label="Username"
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
              type="password"
              name="password"
              label="Password"
              errorMessage={errors.password?.message}
              {...register("password", {
                required: "Le mot de passe est obligatoire",
                minLength: {
                  value: 8,
                  message: "Le mot de passe doit contenir au moins 8 caractères",
                },
              })}
            />
          </div>

          <div>
            <Button
              id="button_submit"
              type="submit"
              className="w-full"
            >
              Sign in
            </Button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            id="link_register"
            href="/register"
            className={`font-medium ${
              theme === "dark" ? "text-white" : "text-black"
            } hover:underline`}
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
