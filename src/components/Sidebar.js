import React, { useState, useEffect } from "react";
import { IconButton, Avatar, Input } from "@material-ui/core";
import "../styles/Sidebar.css";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import db from "./Firebase";
import { log } from "pusher-js";
import { useStateValue } from "../StateProvider";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const toggle = () => setIsMoreOpen(!isMoreOpen);

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    //cleanup fun to clear resources
    return () => {
      unsubscribe();
    };
  }, []);

  const createChatRoom = () => {
    let roomName = null;
    while (!roomName) {
      roomName = prompt("Enter room name");
    }

    //add room name to database
    db.collection("rooms").add({
      name: roomName,
    });
  };

  return (
    <div className="sidebar">
      <div className="siderbar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={toggle}>
            <MoreVertIcon />
          </IconButton>
          <div
            className={
              isMoreOpen
                ? ` sidebar__moreOptions`
                : `sidebar__moreOptionsClosed`
            }
          >
            <button onClick={createChatRoom}>New Group</button>
          </div>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

// "https://avatars.githubusercontent.com/u/65816651?s=400&u=54184e68f2443fb5fa716a925ce64c4e73d18b4d&v=4" />
