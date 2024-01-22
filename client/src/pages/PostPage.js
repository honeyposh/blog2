import { useEffect, useState, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
export default function PostPage() {
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:8000/api/getpost/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPost(postInfo.post);
      });
    });
  }, []);
  async function deletePost() {
    const token = localStorage.getItem("Authtoken");
    const response = await fetch(`http://localhost:8000/api/deletepost/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
      },
    });
    setRedirect(true);
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  if (!post) return "";
  console.log(userInfo?._id === post.postedBy?._id);
  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <time>{formatISO9075(new Date(post.createdAt))}</time>
      <div className="author">PostedBy:{post.postedBy.name}</div>
      {userInfo?._id === post.postedBy?._id && (
        <div className="edit-row">
          <Link to={`/edit/${post._id}`} className="edit-btn">
            Edit this post
          </Link>
          <button onClick={deletePost} className="btn">
            Delete
          </button>
        </div>
      )}
      {userInfo?.id === post.postedBy?._id && (
        <div className="edit-row">
          <Link to={`/edit/${post._id}`} className="edit-btn">
            Edit this post
          </Link>
          <button onClick={deletePost} className="btn">
            Delete
          </button>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:8000/${post.imageUrl}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
