import { Button } from "@/components/ui/button";
import { useTheme } from "@/layouts/themeProvider/ThemeProvider";

const Home = () => {
  const { theme } = useTheme();

  return (
    <>
      <div
        id="container"
        className={`flex flex-col items-center justify-center min-h-screen text-center ${
          theme === "dark" ? "bg-black text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <h1
          className={`text-4xl font-extrabold sm:text-5xl md:text-6xl ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          <span className="block">Manage Your Tasks</span>
          <span
            className={`block ${
              theme === "dark" ? "text-yellow-400" : "text-primary-600"
            }`}
          >
            Efficiently and Securely
          </span>
        </h1>
        <p
          className={`mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          A simple and intuitive task management system to help you stay
          organized and productive.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <a id="get_started" href="/login">
              <Button>Get Started</Button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
