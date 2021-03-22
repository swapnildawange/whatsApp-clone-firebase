import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import "./App.css";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { Route, Router, Switch, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import { useStateValue } from "./StateProvider";
function App() {
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  //get real time messages using pusher
  useEffect(() => {
    const pusher = new Pusher("a5628f749a7ea5b9b891", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("insertd", function (newMessage) {
      setMessages([...messages, newMessage]);
      // alert(JSON.stringify(newMessage));
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <BrowserRouter>
            <Sidebar />
            <Switch>
              <Route
                path="/rooms/:roomId"
                children={<Chat chat={messages} />}
              />
            </Switch>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;
