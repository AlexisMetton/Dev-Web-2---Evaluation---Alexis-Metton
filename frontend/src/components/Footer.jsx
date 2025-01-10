const Footer = () => {
    return (
      <footer className="bg-opacity-10 backdrop-blur-lg text-center py-4 w-full">
        <div className="px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  