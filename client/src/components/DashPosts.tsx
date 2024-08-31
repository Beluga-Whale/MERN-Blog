import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { Table } from "flowbite-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
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
    <div className="table-auto  md:mx-auto overflow-x-auto  ">
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
                    <p className="hover:underline text-red-500 cursor-pointer font-bold ">
                      Delete
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-orange-300 hover:underline font-bold  "
                      to={`/update-posts/${post._id}`}
                    >
                      EDIT
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};

export default DashPosts;
