import { Outlet } from "react-router-dom";
import LeftSideBar from "./LeftSideBar";
import NavBar from "./TopNavBar";
import RightSideBar from "./RightSideBar";
import BottomMobileNavBar from "./BottomMobileNavBar";

function AppLayout() {
  return (
    <div className="flex flex-col w-full bg-[#f8f8fa] dark:bg-[#282C34] transition-colors min-w-[360px]">
      <NavBar />
      <div className="sm:grid sm:grid-cols-[200px_calc(100vw-200px-10px)] xl:grid-cols-[200px_calc(100vw-200px_-_300px-10px)_300px]">
        <LeftSideBar />
        <div className="md:px-10 px-3 text-gray-950 min-h-screen">
          <Outlet />
        </div>
        <RightSideBar className="!hidden xl:!block h-[calc(100vh-3rem)] sticky top-12 mr-2" />
        <BottomMobileNavBar />
      </div>
    </div>
  );
}

export default AppLayout;
