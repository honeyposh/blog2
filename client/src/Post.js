import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
export default function Post({
  _id,
  title,
  content,
  createdAt,
  postedBy,
  imageUrl,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img
            src={"https://blogbackend1-tugp.onrender.com/" + imageUrl}
            alt=""
          />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">PostedBy:{postedBy.name}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </p>
      </div>
    </div>
  );
}
