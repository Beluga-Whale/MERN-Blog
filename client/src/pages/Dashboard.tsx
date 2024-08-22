import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import DashSidebar from "./DashSidebar";
import DashProfile from "./DashProfile";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState<string>("");

  useEffect(() => {
    // NOTE - get query search behinde tab
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl ?? "");
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w-56">
        {/* NOTE - Side bar */}
        <DashSidebar />
      </div>
      {/* NOTE - Profile */}
      {tab === "profile" && <DashProfile />}
    </div>
  );
};

export default Dashboard;
