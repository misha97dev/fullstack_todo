import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [tasks, setTasks] = useState(null);
  const token = cookies.token;
  const userEmail = cookies.email;
  const getData = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}todos/${userEmail}`
      );
      const resJson = await res.json();
      setTasks(resJson);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  const tasksSorted = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  return (
    <div className="App">
      {!token && <Auth />}

      {token && (
        <div>
          <ListHeader name="🏠 Home tasks" getData={getData} />
          {tasksSorted?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
