import { useState } from "react";
// import { useAsyncError } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  async function register(e) {
    e.preventDefault();
    const response = await fetch(
      "https://blogbackend1-tugp.onrender.com/api/signup",
      {
        method: "POST",
        body: JSON.stringify({ username, password, email, name }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 201) {
      alert("Registration succesful!!!");
    } else {
      alert("Registration failed");
    }
    // console.log(response);
  }
  return (
    <form className="signup" onSubmit={register}>
      <h1>Signup</h1>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />

      <button>Signup</button>
    </form>
  );
}
