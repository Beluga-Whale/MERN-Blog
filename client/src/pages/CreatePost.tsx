import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { FirebaseError } from "firebase/app";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface FormDataType {
  title?: string;
  category?: string;
  image?: string;
  content?: string;
}

const CreatePost = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType | undefined>(undefined);
  const [craetePostError, setCreatePostError] = useState<string | null>(null);

  const navigate = useNavigate();

  // NOTE - จัดการเก็บ file ลงใน state
  const handelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file !== undefined) {
      setFile(e.target?.files?.[0] ?? null);
      // setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadFile = () => {
    try {
      if (!file) {
        setImageUploadError("Please choose image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Number(progress.toFixed(0)));
        },
        (error: FirebaseError) => {
          setImageUploadError(error.message);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            if (downLoadURL !== undefined) {
              setFormData({ ...formData, image: downLoadURL });
            }
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!formData?.image) {
      return setCreatePostError("You have't upload you image ");
    }
    // NOTE - เคลียค่า CreatePostError อาจเกิดจาก ไม่ได้ uploadimage
    setCreatePostError(null);
    try {
      const data = await axios.post("/api/post/create", formData);
      // NOTE - ถ้า update ไม่สำเร็จก้ให้ response error ออกมาเก็บใน state
      if (data?.status !== 201) {
        setCreatePostError(data?.data);
      } else {
        setCreatePostError(null);

        Swal.fire({
          icon: "success",
          title: "Create Success",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate(`/post/${data?.data?.slug}`);
          }
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setCreatePostError(error?.response?.data?.message);
      } else {
        setCreatePostError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="p-3 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select a category</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="knowledge">Knowledge</option>
          </Select>
        </div>
        <div className="flex justify-between gap-4 border-4 border-teal-500 border-dotted p-3">
          <FileInput
            // className="w-full"
            accept="image/*"
            onChange={handelFile}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadFile}
            disabled={
              imageUploadProgress !== null && imageUploadProgress > 0
                ? true
                : false
            }
          >
            Upload Image
          </Button>
        </div>
        {imageUploadError ? (
          <Alert color="failure">{imageUploadError}</Alert>
        ) : null}
        {formData?.image && (
          <div className="w-full h-72 self-center">
            <img
              className=" rounded-xl h-full object-cover border-8 w-full"
              src={formData?.image}
              alt="user"
            />
          </div>
        )}
        <ReactQuill
          className="h-72 mb-12"
          theme="snow"
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        {craetePostError && <Alert color="failure">{craetePostError}</Alert>}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
