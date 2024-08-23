import React from "react";
import { useAppSelector } from "../redux/hooks";
import { Button, FloatingLabel } from "flowbite-react";

const DashProfile = () => {
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );

  return (
    <div className="max-w-lg w-full mx-auto p-4">
      <h1 className="text-center my-5 font-semibold text-3xl">My Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center ">
          <img
            className="rounded-full h-full object-cover border-8 w-full"
            src={
              currentUser?.profilePicture || currentUserGoogle?.profilePicture
            }
            alt="user"
          />
        </div>

        <FloatingLabel
          variant="outlined"
          type="username"
          label="Your username"
          id="username"
          defaultValue={currentUser?.username || currentUserGoogle?.username}
        />
        <FloatingLabel
          variant="outlined"
          type="email"
          label="Your email"
          id="email"
          defaultValue={currentUser?.email || currentUserGoogle?.email}
        />
        <FloatingLabel
          variant="outlined"
          type="password"
          label="Your password"
          id="password"
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-end mt-4">
        <p className=" cursor-pointer text-red-300">Sign Out</p>
      </div>
    </div>
  );
};

export default DashProfile;
