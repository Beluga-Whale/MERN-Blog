import { Button, Select, TextInput } from "flowbite-react";
import React, { FormEvent, useEffect, useState } from "react";
import { PostDetail } from "./PostPage";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

interface SearchType {
  searchTerm?: string;
  sort: string;
  category?: string;
}

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarSearch, setSidebarSearch] = useState<SearchType>({
    searchTerm: "",
    sort: "desc",
    category: "",
  });

  const [posts, setPosts] = useState<PostDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  console.log("posts", posts);

  //   NOTE - Handle change value
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.id === "searchTerm") {
      setSidebarSearch({ ...sidebarSearch, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      setSidebarSearch({ ...sidebarSearch, sort: e.target.value || "desc" });
    }
    if (e.target.id === "category") {
      setSidebarSearch({ ...sidebarSearch, category: e.target.value });
    }
  };

  //   NOTE - Handle Submit for search
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // NOTE - Set query string จากการ searh side bar
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarSearch?.searchTerm ?? "");
    urlParams.set("sort", sidebarSearch?.sort);
    urlParams.set("category", sidebarSearch?.category ?? "");
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  //   NOTE - Fetch posts form search
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const sortFromUrl = urlParams.get("sort") || "desc";
    const categoryFromUrl = urlParams.get("category") || "";

    setSidebarSearch({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
    });

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarSearch({
        ...sidebarSearch,
        searchTerm: searchTermFromUrl || undefined,
        sort: sortFromUrl ?? "desc",
        category: categoryFromUrl || undefined,
      });
    }
    const fetchPostSearch = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axios.get(`/api/post/getposts?${searchQuery}`);

        // NOTE - เช็คว่า status 200 ถ้าใช่ให้ set data ลงใน setPost
        if (res.status == 200) {
          setPosts(res?.data?.posts);

          setLoading(false);
          if (res?.data?.posts.length > 2) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        } else {
          setLoading(false);
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchPostSearch();
  }, [location.search]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex.toString());

    try {
      const res = await axios.get(`/api/post/getposts?${urlParams.toString()}`);
      if (res.status === 200) {
        setPosts([...posts, ...res.data.posts]);
        if (res?.data.length > 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row ">
      <div className="p-7 border-b md:border-r md:min-h-screen">
        <form
          className="flex flex-col gap-8 border-gray"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap ">Search Term: </label>
            <TextInput
              type="text"
              id="searchTerm"
              placeholder="Search..."
              color="gray"
              value={sidebarSearch?.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>Sort: </label>
            <Select
              onChange={handleChange}
              value={sidebarSearch?.sort}
              id="sort"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label>Category: </label>
            <Select
              onChange={handleChange}
              value={sidebarSearch?.category}
              id="category"
            >
              <option value="">Uncategorized</option>
              <option value="travel">Travel</option>
              <option value="health">Health</option>
              <option value="food">Food</option>
              <option value="knowledge">Knowledge</option>
            </Select>
          </div>
          <Button gradientDuoTone="purpleToPink" outline type="submit">
            Search
          </Button>
        </form>
      </div>
      {loading === true ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full my-4">
          <h1 className="text-center text-xl border-b  pb-3 ">Posts results</h1>
          <div className="gap-4 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto  ">
            {posts?.map((item) => (
              <PostCard key={item?._id} postInfo={item} />
            ))}
          </div>
          <div className="flex justify-center">
            {showMore && (
              <Button
                type="button"
                onClick={handleShowMore}
                gradientDuoTone="purpleToPink"
              >
                SHOW MORE
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
