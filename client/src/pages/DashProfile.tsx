import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Alert, Button, FloatingLabel } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Progress } from "flowbite-react";
import {
  resetState,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import axios, { AxiosError, AxiosResponse } from "axios";

interface FormDataType {
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

const DashProfile = () => {
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  const { updateProfileError } = useAppSelector((state) => state.user);

  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState<
    boolean | null
  >(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<FormDataType | undefined>(undefined);

  const dispatch = useAppDispatch();

  const handelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file !== undefined) {
      setImageFile(e.target?.files?.[0] ?? null);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const upLoadImage = () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write : if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches("image/.*")
    //     }
    //   }
    // }
    const storage = getStorage(app);
    if (imageFile) {
      const fileName = new Date().getTime() + imageFile?.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(Number(progress?.toFixed(0)));
        },
        // NOTE - ถ้า error จะให้ set ลงใน setImageFileUploadError
        () => {
          setImageFileUploadError(
            "Coulg not upload image (File must be less than 2MB)"
          );
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
        },
        // NOTE - ถ้าสำเสร็จ
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePicture: downloadURL });
          });
        }
      );
    }
  };

  const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // NOTE - Update form
  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    // NOTE - Check ว่ามีการเปลี่ยนของ formData ไหมถ้าไม่มีให้จบการทำง่านเลย
    if (
      !formData?.email &&
      !formData?.username &&
      !formData?.password &&
      !formData?.profilePicture
    ) {
      return;
    }
    dispatch(updateStart());
    try {
      const res: AxiosResponse = await axios.put(
        `api/user/update/${currentUser?._id || currentUserGoogle?._id}`,
        {
          profilePicture: formData?.profilePicture,
          username: formData?.username,
          email: formData?.email,
          password: formData?.password,
        }
      );
      if (res?.status !== 200) {
        dispatch(updateFailure(res.data));
        setUpdateProfileSuccess(false);
      } else {
        const typeUpdateProfile = currentUser ? "db" : "google";
        dispatch(
          updateSuccess({ typeUpdate: typeUpdateProfile, data: res?.data })
        );
        setUpdateProfileSuccess(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(updateFailure(error?.response?.data?.message));
        setUpdateProfileSuccess(false);
      } else {
        dispatch(updateFailure("An unexpected error occurred."));
        setUpdateProfileSuccess(false);
      }
    }
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

  useEffect(() => {
    if (imageFile) {
      upLoadImage();
    }
    return () => {
      dispatch(updateFailure(null));
      setUpdateProfileSuccess(null);
    };
  }, [imageFile]);
  return (
    <div className="max-w-lg w-full mx-auto p-4">
      <h1 className="text-center my-5 font-semibold text-3xl">My Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handelFile}
          ref={filePickerRef}
          style={{ display: "none" }}
        />
        <div
          className="w-32 h-32 self-center cursor-pointer  "
          onClick={() => {
            filePickerRef.current?.click();
          }}
        >
          <img
            className="rounded-full h-full object-cover border-8 w-full"
            src={
              imageFileUrl ||
              currentUser?.profilePicture ||
              currentUserGoogle?.profilePicture
            }
            alt="user"
          />
        </div>
        {/* NOTE - if upload fail */}
        {imageFileUploadError && (
          <Alert color="failure">imageFileUploadError</Alert>
        )}

        {/* NOTE - if upload success */}
        {imageFileUploadProgress ? (
          <Alert color="success">Upload Success</Alert>
        ) : null}

        {/* NOTE - progrees bar when upload */}
        {imageFileUploadProgress ? (
          <Progress
            className={`${imageFileUploadProgress === 100 && "hidden"}`}
            progress={imageFileUploadProgress}
            textLabel="Uploading"
            size="lg"
            labelProgress
            labelText
          />
        ) : null}

        <FloatingLabel
          variant="outlined"
          type="username"
          label="Your username"
          id="username"
          onChange={handleForm}
          defaultValue={currentUser?.username || currentUserGoogle?.username}
        />
        <FloatingLabel
          variant="outlined"
          type="email"
          label="Your email"
          id="email"
          onChange={handleForm}
          defaultValue={currentUser?.email || currentUserGoogle?.email}
        />
        <FloatingLabel
          variant="outlined"
          type="password"
          label="Your password"
          id="password"
          onChange={handleForm}
        />
        {updateProfileError ? (
          <Alert color="failure">{updateProfileError}</Alert>
        ) : null}

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        {updateProfileSuccess && <Alert color="success">Update Success</Alert>}
      </form>
      <div className="text-end mt-4">
        <p className=" cursor-pointer text-red-300" onClick={handleSignout}>
          Sign Out
        </p>
      </div>
    </div>
  );
};

export default DashProfile;
