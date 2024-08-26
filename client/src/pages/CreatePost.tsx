import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const CreatePost = () => {
  const [value, setValue] = useState("");
  console.log("Value", value);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className=" flex flex-col sm:flex-row gap-4">
          <TextInput type="text" placeholder="Title" required id="title" />
          <Select>
            <option value="">Select a category</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="knowledge">Knowledge</option>
          </Select>
        </div>
        <div className="flex gap-4 border-4 border-teal-500 border-dotted p-3 ">
          <FileInput className="w-full" accept="image/*" />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="h-72 mb-12 "
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
