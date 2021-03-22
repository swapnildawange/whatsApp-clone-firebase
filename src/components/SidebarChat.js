import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import "../styles/SidebarChat.css";
import db from "./Firebase";

function SidebarChat({ id, name }) {
  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timeStamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  // console.log(messages);
  return (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/:${id}.svg`} />
        <div className="sidebarChat__info">
          <h3>{name}</h3>
          <p>{messages[0]?.message.substring(0, 160)}</p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
