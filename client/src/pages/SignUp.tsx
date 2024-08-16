import { Button, FloatingLabel } from "flowbite-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20 ">
      <div className="flex p-3 max-w-3xl mx-auto  flex-col md:flex-row md:items-center gap-5">
        <div className="left flex-1">
          <Link to="/" className="   font-bold  dark:text-white text-4xl  ">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
              Beluga
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a web blog where we share knowledge from you guys.{" "}
          </p>
        </div>
        <div className="right flex-1">
          <form className="flex flex-col gap-4">
            <FloatingLabel
              variant="outlined"
              type="text"
              label="Your username"
              id="username"
            />
            <FloatingLabel
              variant="outlined"
              type="email"
              label="You email"
              placeholder="name@gmail.com"
              id="email"
            />
            <FloatingLabel
              variant="outlined"
              type="password"
              label="Your password"
              id="password"
            />
            <Button gradientDuoTone="purpleToPink" type="submit">
              Sign Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
