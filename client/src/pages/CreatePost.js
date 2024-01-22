// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    data.set("file", files[0]);
    e.preventDefault();
    // console.log(files);
    const token = localStorage.getItem("Authtoken");
    const response = await fetch("http://localhost:8000/api/createpost", {
      method: "POST",
      body: data,
      // credentials: "include",
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
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
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}> Create post</button>
    </form>
  );
}
