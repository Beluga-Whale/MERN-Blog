import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleTheme } from "../redux/theme/themeSlice";
import axios from "axios";
import { resetState } from "../redux/user/userSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  const { theme } = useAppSelector((state) => state.theme);
  const { pathname } = useLocation();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

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
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold  dark:text-white "
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
          Beluga
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden " color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex items-center gap-2 md:order-2 ">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={handleToggleTheme}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser || currentUserGoogle ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={
                  currentUser?.profilePicture ||
                  currentUserGoogle?.profilePicture ||
                  undefined
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="text-sm block">
                @{currentUser?.username || currentUserGoogle?.username}
              </span>
              <span className="text-sm block font-medium ">
                @{currentUser?.email || currentUserGoogle?.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline color="gray" pill>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={pathname === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={pathname === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={pathname === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
