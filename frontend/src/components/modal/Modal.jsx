import { Button } from "@/components/ui/button";

const Modal = ({ show, onClose, title, children, theme, actions }) => {
  if (!show) return null;

  const modalThemeClass =
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-300";

  const buttonThemeClass =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-gray-300 hover:bg-gray-400 text-gray-800";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className={`rounded-lg shadow-lg p-6 w-1/3 border ${modalThemeClass}`}
      >
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div>{children}</div>
        <div className="flex justify-end space-x-4 mt-4">
          {actions?.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.className} ${
                theme === "dark" ? "hover:brightness-110" : ""
              }`}
            >
              {action.label}
            </Button>
          ))}
          <Button onClick={onClose} className={buttonThemeClass}>
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
