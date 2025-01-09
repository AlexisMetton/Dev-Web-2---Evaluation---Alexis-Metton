import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <div
        id="container"
        className="flex flex-col items-center justify-center min-h-screen text-center"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Manage Your Tasks</span>
          <span className="block text-primary-600">Efficiently and Securely</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A simple and intuitive task management system to help you stay
          organized and productive.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <a id="get_started" href="/login">
              <Button>Get Started</Button>
            </a>
          </div>
          {/* <!-- <div className="rounded-md shadow">
			<a href="/tasks">
				<Button>
					Mes tâches
				</Button>
			</a>
		</div> --> */}
        </div>
      </div>
    </>
  );
};

export default Home;
