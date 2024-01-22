import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    fetch("http://localhost:8000/api/getpost/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.post.title);
        setContent(postInfo.post.content);
      });
    });
  }, []);
  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const token = localStorage.getItem("Authtoken");
    await fetch("http://localhost:8000/api/updatepost/" + id, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: `${token}`,
      },
    });
    setRedirect(true);
  }
  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="file"
        // value={image}
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}> update post</button>
    </form>
  );
}
