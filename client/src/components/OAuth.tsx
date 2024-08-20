import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios, { AxiosError } from "axios";
import { useAppDispatch } from "../redux/hooks";
import {
  signInFailure,
  signInGoggleSuccess,
  signInStart,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    dispatch(signInStart());
    try {
      const resultFormGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post("api/auth/google", {
        name: resultFormGoogle?.user?.displayName,
        email: resultFormGoogle?.user?.email,
        googlePhotoUrl: resultFormGoogle?.user?.photoURL,
      });

      if (res.status == 200) {
        dispatch(signInGoggleSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(signInFailure(error?.response?.data?.message));
      } else {
        dispatch(signInFailure("An unexpected error occurred."));
      }
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      <p className="mt-[2px]">Continue with Google</p>
    </Button>
  );
};

export default OAuth;
