import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-white dark:bg-[#20232a] h-screen overflow-hidden">
      <span className="text-gray-900 dark:text-gray-200 text-2xl">
        Page not found 🥹
      </span>
      <Link
        to={"/"}
        className="text-2xl bg-gray-200 hover:bg-gray-300 rounded px-4 py-1">
        Home
      </Link>
    </div>
  );
}

export default NotFound;
