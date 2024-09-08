import { useEffect, useRef, useState } from "react";
import { commentUserType } from "./CommentSection";
import axios from "axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useAppSelector } from "../redux/hooks";
import { Button, Textarea } from "flowbite-react";

interface CommentProps {
  comment: commentUserType;
  handleLike: (commentId: string) => Promise<void>;
  handleEdit: (commentId: string, editContent: string) => Promise<void>;
  handleDelete: (commentId: string) => Promise<void>;
}

interface UserType {
  profilePicture: string;
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  isAdmin: boolean;
}

const Comment = ({
  comment,
  handleLike,
  handleEdit,
  handleDelete,
}: CommentProps) => {
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [commentEdit, setCommentEdit] = useState<string | undefined>("");
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  const commentRef = useRef<HTMLDivElement>(null);
  const handleToggleEdit = () => {
    setIsEdit(true);
    setCommentEdit(comment?.content);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/comment/editComment/${comment?._id}`, {
        content: commentEdit,
      });
      if (res?.status == 200) {
        setIsEdit(false);
        handleEdit(comment?._id, commentEdit ?? "");

        commentRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.log("Error edit comment", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/user/${comment?.userId}`);

        if (res?.status === 200) {
          setUser(res?.data);
        }
      } catch (error) {
        console.log("error getUser", error);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 text-sm border-b items-center ">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className="flex-1">
        {/* NOTE - User */}
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymouse"}
          </span>
          <span className="text-gray-500">
            {moment(comment?.createdAt).fromNow()}{" "}
          </span>
        </div>
        {/* NOTE - Content */}
        {isEdit ? (
          <>
            <Textarea
              placeholder="Leave a comment..."
              required
              rows={4}
              maxLength={250}
              value={commentEdit}
              onChange={(e) => setCommentEdit(e.target.value)}
            />
            <div className="flex justify-end gap-2 my-5 ">
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
              <Button
                type="button"
                color="red"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment?.content}</p>
            {/* NOTE - Like */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${
                  (currentUser || currentUserGoogle) &&
                  comment?.likes.includes(
                    (currentUser?._id || currentUserGoogle?._id) ?? ""
                  ) &&
                  "!text-blue-500"
                }`}
                onClick={() => handleLike(comment?._id)}
              >
                <FaThumbsUp className={`text-sm }`} />
              </button>
              <p className="text-gray-400">
                {comment?.numberOfLikes > 0 &&
                  comment?.numberOfLikes +
                    " " +
                    (comment?.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {comment?.userId ==
                (currentUser?._id || currentUserGoogle?._id) && (
                <>
                  {/* NOTE - Edit Comment */}
                  <button
                    type="button"
                    className="hover:underline hover:text-blue-500 "
                    onClick={handleToggleEdit}
                  >
                    Edit
                  </button>
                  {/* NOTE - Delete Comment */}
                  <button
                    type="button"
                    className="hover:underline hover:text-red-500 "
                    onClick={() => handleDelete(comment?._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
