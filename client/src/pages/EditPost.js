import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState();
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
  useEffect(() => {
    fetch("http://localhost:8000/api/api/getpost/" + id).then((response) => {
      response.json().then((postInfo) => {
        setTitle(postInfo.post.title);
        setContent(postInfo.post.content);
        setImageUrl(postInfo.post.imageUrl);
      });
    });
  }, []);
  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("content", content);
    data.set("imageUrl", imageUrl);
    // if (files?.[0]) {
    //   data.set("file", files?.[0]);
    // }
    const token = localStorage.getItem("Authtoken");
    await fetch("https://blogbackend1-tugp.onrender.com/api/updatepost/" + id, {
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
    <form onSubmit={updatePost} enctype="multipart/form-data">
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input type="file" onChange={handleImage} name="imageUrl" />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}> update post</button>
    </form>
  );
}
