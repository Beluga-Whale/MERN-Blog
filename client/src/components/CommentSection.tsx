import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { Alert, Button, Textarea } from "flowbite-react";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import Comment from "./Comment";

interface CommentSectionProps {
  postId: string | undefined;
}

export interface commentUserType {
  _id: string;
  userId: string;
  content: string;
  likes: string[];
  numberOfLikes: number;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const navigate = useNavigate();
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );

  const [comment, setComment] = useState<string | undefined>("");
  const [errorComment, setErrorComment] = useState<string | undefined>("");
  const [commentUser, setCommentUser] = useState<commentUserType[] | undefined>(
    undefined
  );

  const handleLike = async (commentId: string) => {
    try {
      if (!currentUser && !currentUserGoogle) {
        return navigate("/sign-in");
      }
      const res = await axios.put(`/api/comment/likeComment/${commentId}`);
      if (res.status == 200) {
        // NOTE - Update commentUser
        setCommentUser(
          commentUser?.map(
            (item) =>
              item._id === commentId
                ? {
                    ...item,
                    likes: res?.data?.likes,
                    numberOfLikes: res?.data?.likes.length,
                  }
                : item //NOTE - Return the item as is if the condition is not met
          )
        );
      }
    } catch (error) {
      console.log("Error like", error);
    }
  };

  const fetchComment = async () => {
    try {
      const res = await axios.get(`/api/comment/getPostComments/${postId}`);

      setCommentUser(res?.data);
    } catch (error) {
      console.log("Error show comment", error);
    }
  };

  //   NOTE - บันทึก Comment
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment !== undefined && comment?.length > 200) {
      return;
    }
    try {
      const res = await axios.post("/api/comment/create", {
        content: comment,
        postId,
        userId: currentUser?._id || currentUserGoogle?._id,
      });
      if (res?.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Add your comment to post",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          setComment("");
          setErrorComment(undefined);
          fetchComment();
        });
      } else {
        console.log("error comment", res?.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorComment(error?.response?.data?.message);
      } else {
        setErrorComment("An unexpected error occurred.");
      }
    }
  };

  // NOTE - แก้ไข comment
  const handleEdit = async (commentId: string, editContent: string) => {
    setCommentUser(
      commentUser?.map(
        (item) =>
          item._id === commentId
            ? {
                ...item,
                content: editContent,
              }
            : item //NOTE - Return the item as is if the condition is not met
      )
    );
  };

  // NOTE - Delete comment
  const handleDelete = async (commentId: string) => {
    try {
      Swal.fire({
        title: "You want to delete this comment?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await axios.delete(
            `/api/comment/deleteComment/${commentId}`
          );
          if (res.status === 200) {
            setCommentUser(
              commentUser?.filter((item) => item._id !== commentId)
            );
          }
        }
      });
    } catch (error) {
      console.log("Delete comment Error", error);
    }
  };

  useEffect(() => {
    fetchComment();
  }, [postId]);

  return (
    <div className="  max-w-2xl mx-auto p-3 w-full ">
      {currentUser || currentUserGoogle ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-7 w-7 object-cover rounded-full "
            src={
              currentUserGoogle?.profilePicture || currentUser?.profilePicture
            }
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-cyan-400 hover:underline "
            onClick={() => window.scrollTo(0, 0)}
          >
            {currentUser?.username || currentUserGoogle?.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm  my-5  gap-1">
          Yoy must to loggin for comment.
          <Link
            className="text-blue-500 hover:underline "
            to="/sign-in"
            onClick={() => window.scrollTo(0, 0)}
          >
            Sign in
          </Link>
        </div>
      )}
      {(currentUser || currentUserGoogle) && (
        <form
          className="border-2 rounded-md border-red-300 p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Leave a comment..."
            required
            rows={4}
            maxLength={250}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500">
              {comment !== undefined ? 250 - comment?.length : 250} characters
              remaining
            </p>
            <Button type="submit" outline gradientDuoTone="purpleToPink">
              Submit
            </Button>
          </div>
          {errorComment && (
            <Alert color="failure" className="mt-5">
              {errorComment}
            </Alert>
          )}
        </form>
      )}
      {commentUser?.length === 9 ? (
        <p>This post is no comment</p>
      ) : (
        <>
          <div className="mt-5">
            <p>
              Comment{" "}
              <span className="text-blue-500 ">{commentUser?.length}</span>{" "}
              comments{" "}
            </p>
          </div>
          {commentUser?.map((comment) => (
            <Comment
              key={comment?._id}
              comment={comment}
              handleLike={handleLike}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
