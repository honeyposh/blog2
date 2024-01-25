import { useEffect, useState, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
export default function PostPage() {
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  console.log(post);
  console.log(userInfo);
  // console.log(userInfo.username);
  useEffect(() => {
    fetch(`https://blogbackend1-tugp.onrender.com/api/getpost/${id}`).then(
      (response) => {
        response.json().then((postInfo) => {
          setPost(postInfo.post);
        });
      }
    );
  }, []);

  // console.log(userInfo?.id === post.comments.postedBy?._id);
  async function handleSubmit(e) {
    e.preventDefault(e);
    const token = localStorage.getItem("Authtoken");
    const updatedPost = await fetch(`http://localhost:8000/api/comment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ comment }),
    }).then((response) => {
      response.json();
    });
    setPost(updatedPost);
    setComment("");
    setRedirect(true);
  }
  async function deletePost() {
    const token = localStorage.getItem("Authtoken");
    const response = await fetch(
      `https://blogbackend1-tugp.onrender.com/api/deletepost/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    setRedirect(true);
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  if (!post) return "";
  // console.log(userInfo?._id === post.postedBy?._id);

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <time>{formatISO9075(new Date(post.createdAt))}</time>
      <div className="author">PostedBy:{post.postedBy.name}</div>
      {userInfo?.username === post.postedBy?.username && (
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
        <img
          src={`https://blogbackend1-tugp.onrender.com/${post.imageUrl}`}
          alt=""
        />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div>
        <h2>Comments [{post.comments?.length}]</h2>
      </div>
      <div className="CommentContainer">
        {post.comments?.length > 0 &&
          post.comments.map((comment) => (
            <div key={comment.id} className="SingleComment">
              <div className="CommentInfo">
                {" "}
                <span className="user">
                  {comment.postedBy.username} :{" "}
                </span>{" "}
                <span className="CommentDate">
                  {format(new Date(comment.created), "MMM d yyyy")}
                </span>{" "}
              </div>{" "}
              <span>{comment.text}</span>
              {userInfo?.username === comment.postedBy?.username && (
                <button className="delete-comment-btn">Delete</button>
              )}
              <hr />
            </div>
          ))}
        {userInfo?._id && (
          <div className="Comments">
            <form onSubmit={handleSubmit}>
              <input
                required="true"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                type="text"
                placeholder="write a comment"
                value={comment}
              />
              <button className="btn">Add Comment</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
