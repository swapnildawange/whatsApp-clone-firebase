import { Avatar, IconButton } from "@material-ui/core";
import {
  InsertEmoticonOutlined,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import Moment from "react-moment";
import "moment-timezone";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import "../styles/Chat.css";
import db from "./Firebase";
import firebase from "firebase";
import Picker from "emoji-picker-react";
function Chat({ chat }) {
  const [newMessage, setNewMessage] = useState([]);
  let { roomId } = useParams(null);

  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [getEmoji, setgetEmoji] = useState(true);

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage((newMessage) => {
      return newMessage + emojiObject.emoji;
    });
  };

  useEffect(() => {
    // get the chat for room with given id
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timeStamp", "asc")
        .onSnapshot((snapshot) =>
          setMessage(snapshot.docs.map((doc) => doc.data()))
        );
    }
    // console.log(roomId, roomName);
  }, [roomId]);
  console.log(roomId);
  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        message: newMessage,
        name: user.displayName,
        email: user.email,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setNewMessage("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/:${roomId}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            last seen&nbsp;
            <Moment format="hh:mm A">
              {new Date(
                message[message.length - 1]?.timeStamp?.toDate()
              ).toUTCString()}
            </Moment>
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {/* {console.log(message.email, user.email)} */}
        {message.map((message) => (
          <div
            key={message.id}
            className={`chat__message ${
              message.email === user.email
                ? `chat__receiver`
                : `chat__messageSender`
            }`}
          >
            <div
              className={`${
                message.email === user.email
                  ? `chat__nameReceiver`
                  : `chat__name`
              }`}
            >
              <p>{message.name}</p>
            </div>
            <div className="chat__MessageText">
              <p>{message.message}</p>
            </div>
            <div className="chat__timestamp">
              <p>
                <Moment format="hh:mm A">
                  {new Date(message.timeStamp?.toDate()).toUTCString()}
                </Moment>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat__footer">
        <IconButton onClick={() => setgetEmoji(!getEmoji)}>
          <InsertEmoticonOutlined />
        </IconButton>

        <div className={getEmoji && `chat_emojipikerVisible`}>
          <Picker className="invisible" onEmojiClick={onEmojiClick} />
        </div>
        <form>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type something..."
          />
          <button onClick={sendMessage} type="submit">
            send
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
