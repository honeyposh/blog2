import { useEffect, useState } from "react";
import Post from "../Post";
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/getposts").then((response) => {
      // console.log(response);
      response.json().then((posts) => {
        setPosts(posts.posts);
      });
    });
  }, []);
  return <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</>;
}
