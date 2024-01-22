import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    const token = localStorage.getItem("Authtoken");
    fetch("http://localhost:8000/api/getme", {
      // credentials: "include",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo.user);
      });
    });
  }, []);

  async function logout() {
    localStorage.setItem("Authtoken", "");
    setUserInfo(null);
  }
  const name = userInfo?.name;
  const admin = userInfo?.role;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {name && admin === "admin" && (
          <>
            <Link to="/create">Create new post</Link>
          </>
        )}
        {name && (
          <>
            <Link onClick={logout}>Logout</Link>
          </>
        )}
        {!name && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
