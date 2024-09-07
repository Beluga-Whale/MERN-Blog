import { useEffect, useState } from "react";
import { commentUserType } from "./CommentSection";
import axios from "axios";
import moment from "moment";

interface CommentProps {
  comment: commentUserType;
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

const Comment = ({ comment }: CommentProps) => {
  const [user, setUser] = useState<UserType | undefined>(undefined);

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
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymouse"}
          </span>
          <span className="text-gray-500">
            {moment(comment?.createdAt).fromNow()}{" "}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment?.content}</p>
      </div>
    </div>
  );
};

export default Comment;
