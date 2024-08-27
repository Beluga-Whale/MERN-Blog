import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { FirebaseError } from "firebase/app";

interface FormDataType {
  title?: string;
  category?: string;
  image?: string;
  content?: string;
}

const CreatePost = () => {
  const [value, setValue] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType | undefined>(undefined);

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

  console.log("formData", formData?.image);

  return (
    <div className="p-3 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <TextInput type="text" placeholder="Title" required id="title" />
          <Select>
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
          value={value}
          onChange={setValue}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
