import { useEffect, useState } from "react";
import { PostDetail } from "./PostPage";
import axios from "axios";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [post, setPost] = useState<PostDetail[] | undefined>(undefined);
  useEffect(() => {
    const fetchPostRecommend = async () => {
      try {
        const res = await axios.get(`/api/post/getposts?limit=6`);

        // NOTE - เช็คว่า status 200 ถ้าใช่ให้ set data ลงใน setPost
        if (res.status == 200) {
          setPost(res?.data?.posts);
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostRecommend();
  }, []);

  return (
    <div className="w-full min-h-screen ">
      <div className="flex flex-col gap-6 p-20 ">
        <h1 className="text-3xl font-bold ">Welcome to Beluga Blog</h1>
        <p className="text-gray-400">
          Beluga Blog is my blog to share my knowledge with you. Hope you guys
          like it.{" "}
        </p>
        <Link to={`/search`}>
          <p className="text-blue-500 hover:underline cursor-pointer">
            View all my posts
          </p>
        </Link>
      </div>
      <div className="max-w-7xl mx-auto gap-5  py-7 grid grid-cols-1   sm:grid-cols-2  md:grid-cols-3 ">
        {/*NOTE - Post All */}
        {post?.map((item) => (
          <PostCard key={item?._id} postInfo={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
