import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { Table } from "flowbite-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
interface PostsUser {
  _id?: string;
  userId?: string;
  content?: string;
  title?: string;
  image?: string;
  category?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DashPosts = () => {
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  const [userPosts, setUserPosts] = useState<PostsUser[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);

  // NOTE - Show more
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await axios.get(
        `/api/post/getposts?userId=${
          currentUserGoogle?._id || currentUser?._id
        }&startIndex=${startIndex}`
      );

      if (res.status === 200) {
        setUserPosts((prev) => [...prev, ...res.data.posts]);
        if (res?.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // NOTE - Delete posts
  const handledDelete = async (postId: string, title: string) => {
    try {
      Swal.fire({
        title: "คุณต้องการลบ ?",
        text: title,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ต้องการลบ",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // NOTE - ถ้ากดตกลง จำทะการ delete

          const res = await axios.delete(
            `/api/post/deletepost/${postId}/${
              currentUserGoogle?._id || currentUser?._id
            }`
          );

          if (res?.status === 200) {
            // NOTE - ทำการ fillter post ที่ไม่เท่ากับที่ลบ ออกไป
            setUserPosts((prev) => prev.filter((post) => post._id !== postId));
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `/api/post/getposts?userId=${
            currentUser?._id || currentUserGoogle?._id
          }`
        );

        if (res.status == 200) {
          setUserPosts(res.data?.posts);
          if (res?.data?.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin || currentUserGoogle?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser?._id, currentUserGoogle?._id]);

  return (
    <div className="table-auto w-full p-5  md:mx-auto overflow-x-auto  ">
      {(currentUser?.isAdmin || currentUserGoogle?.isAdmin) &&
      userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts?.map((post: PostsUser) => (
              <Table.Body key={post?._id}>
                <Table.Row>
                  <Table.Cell>
                    {dayjs(post?.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        className="w-30 h-20 object-cover rounded-md"
                        src={post?.image}
                        alt=""
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>{post?.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post?.category}</Table.Cell>
                  <Table.Cell>
                    <p
                      className="hover:underline text-red-500 cursor-pointer font-bold "
                      onClick={() =>
                        handledDelete(post._id ?? "", post?.title ?? "")
                      }
                    >
                      Delete
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-orange-300 hover:underline font-bold  "
                      to={`/edit-post/${post._id}`}
                    >
                      EDIT
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="self-center w-full text-blue-500 hover:underline py-5 "
              onClick={handleShowMore}
            >
              Show more{" "}
            </button>
          )}
        </>
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};

export default DashPosts;
