import { Button, Card } from "flowbite-react";
import { PostDetail } from "../pages/PostPage";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  postInfo: PostDetail;
}

const PostCard = ({ postInfo }: PostCardProps) => {
  const navigate = useNavigate();

  const handleClicktoPost = (slug: string) => {
    navigate(`/post/${slug}`);
    window.scrollTo(0, 0);
  };
  return (
    <div>
      <Card className="max-w-sm">
        <img
          className="w-full h-52 object-cover"
          src={postInfo?.image}
          alt={postInfo?.title}
        />
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {postInfo?.title}
        </h5>
        <div
          className="leading-8  line-clamp-1 "
          dangerouslySetInnerHTML={{ __html: postInfo?.content ?? "" }}
        />
        <p className="text-sm text-gray-400  ">{postInfo?.category}</p>

        <Button
          type="button"
          outline
          gradientDuoTone="purpleToPink"
          onClick={() => handleClicktoPost(postInfo?.slug)}
        >
          Read more
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Card>
    </div>
  );
};

export default PostCard;
