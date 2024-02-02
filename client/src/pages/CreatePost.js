// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  // const [file, setFile] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    console.log(imageUrl);
  };

  async function createNewPost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    data.set("imageUrl", imageUrl);
    const token = localStorage.getItem("Authtoken");
    const response = await fetch(
      "https://blogbackend1-tugp.onrender.com/api/createpost",
      {
        method: "POST",
        body: data,
        // credentials: "include",
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log(response);
    if (response.ok) {
      setRedirect(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost} enctype="multipart/form-data">
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input type="file" onChange={handleImage} name="imageUrl" />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}> Create post</button>
    </form>
  );
}
