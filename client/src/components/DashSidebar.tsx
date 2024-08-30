import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { resetState } from "../redux/user/userSlice";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState<string>("");
  const dispatch = useAppDispatch();

  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout");
      if (res?.status !== 200) {
        console.log(res?.data);
      } else {
        dispatch(resetState());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // NOTE - get query search behinde tab
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl ?? "");
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/dashboard?tab=profile"
            icon={HiUser}
            label={
              currentUser?.isAdmin || currentUserGoogle?.isAdmin
                ? "Admin"
                : "User"
            }
            active={tab === "profile"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
          {/* NOTE - เช็คสิทธิ์ว่าเป็น Addmin?? */}
          {currentUser?.isAdmin ||
            (currentUserGoogle?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=posts"
                icon={HiDocumentText}
                active={tab === "posts"}
                labelColor="dark"
              >
                Posts
              </Sidebar.Item>
            ))}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
