import axios from "axios";
import dayjs from "dayjs";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export interface PostDetail {
  _id: string;
  title: string;
  image: string;
  slug: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const PostPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState<PostDetail | undefined>(undefined);
  const [recommendedPost, setRecommendedPost] = useState<
    PostDetail[] | undefined
  >(undefined);

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/post/getposts?slug=${postSlug}`);

        // NOTE - เช็คว่า status 200 ถ้าใช่ให้ set data ลงใน setPost
        if (res.status == 200) {
          setPost(res?.data?.posts?.[0]);
          setLoading(false);
        } else {
          setLoading(false);
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchPost();
  }, [postSlug]);

  // NOTE Fetch data for recommend
  useEffect(() => {
    const fetchPostRecommend = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/post/getposts?limit=4`);

        // NOTE - เช็คว่า status 200 ถ้าใช่ให้ set data ลงใน setPost
        if (res.status == 200) {
          setRecommendedPost(res?.data?.posts);
          setLoading(false);
        } else {
          setLoading(false);
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchPostRecommend();
  }, []);

  if (loading) {
    return (
      <div>
        <Spinner
          className="flex justify-center items-center min-h-screen"
          size="xl"
        />
      </div>
    );
  }
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen  ">
      {/* NOTE - Titlte */}
      <h1 className="text-3xl lg:text-4xl  mt-10 p-3 text-center font-serif max-w-2xl mx-auto ">
        {post?.title}
      </h1>
      {/* NOTE - Category */}
      <Link
        className="self-center mt-5"
        to={`/search?category=?${post?.category}`}
      >
        <Button color="gray" size="xs" pill>
          {post?.category}
        </Button>
      </Link>
      {/* NOTE - Image */}
      <img
        src={post?.image}
        alt={post?.title}
        className="mt-10 max-h-[600px] w-full object-cover"
      />
      {/* NOTE - Date */}
      <div className="flex text-xs justify-between py-3 border-b border-slate-300 ">
        <p>{dayjs(post?.createdAt).format("DD/MM/YYYY")}</p>
        <p className=" italic ">
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </p>
      </div>
      {/* NOTE - Content */}
      <div
        className="leading-8 border-b pb-5"
        dangerouslySetInnerHTML={{ __html: post?.content ?? "" }}
      />
      {/*NOTE - Random post */}
      <div className="flex flex-col justify-center items-center py-5 border-b">
        <h1 className="text-xl font-bold">Recommended from Beluga Blog</h1>
        <div className="grid grid-cols-1 mt-5 gap-5 md:grid-cols-2 ">
          {recommendedPost?.map((post) => (
            <PostCard key={post?._id} postInfo={post} />
          ))}
        </div>
      </div>
      {/* NOTE - Comment */}
      <CommentSection postId={post?._id} />
    </main>
  );
};

export default PostPage;
