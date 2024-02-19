import { useEffect, useState, useContext } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
// import { format } from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const { userInfo } = useContext(UserContext);
  const [post, setPost] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  // console.log(id);
  // console.log(commentId);
  useEffect(() => {
    fetch(`https://blogbackend1-tugp.onrender.com/api/getpost/${id}`).then(
      (response) => {
        response.json().then((postInfo) => {
          setPost(postInfo.post);
        });
      }
    );
  }, [post]);
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("Authtoken");
    const updatedPost = await fetch(
      `https://blogbackend1-tugp.onrender.com/api/comment/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ comment }),
      }
    ).then((response) => {
      response.json();
    });
    setPost(updatedPost);
    setComment("");
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
  async function removeComment(comment) {
    const token = localStorage.getItem("Authtoken");
    const response = await fetch(
      `https://blogbackend1-tugp.onrender.com/api/posts/${id}/comments/${comment}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log(response);
  }
  if (!post) return <div></div>;

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
      <div className="image">
        <img src={post.imageUrl.url} alt="" />
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
                  {comment.postedBy.username} : {formatISO9075(comment.created)}
                </span>{" "}
              </div>{" "}
              <span>{comment.text}</span>
              {userInfo?._id === comment.postedBy?._id && (
                <button
                  className="delete-comment-btn"
                  onClick={() => removeComment(comment._id)}
                >
                  {" "}
                  Remove Comment
                </button>
              )}
              <hr />
            </div>
          ))}
      </div>
      {userInfo?._id && (
        <form onSubmit={handleSubmit}>
          <input
            onChange={(ev) => setComment(ev.target.value)}
            type="text"
            placeholder="write a comment"
            value={comment}
          />
          <button className="btn">Add Comment</button>
        </form>
      )}
    </div>
  );
}
