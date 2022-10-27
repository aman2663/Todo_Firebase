import { auth, db } from "./config";
import { uid } from "uid";
import { useEffect, useState } from "react";
import { set, ref, onValue, remove, update } from "firebase/database";
import { Button, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import EditIcon from "@mui/icons-material/Edit";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUuid, setTempUuid] = useState("");
  const [user, loading, error] = useAuthState(auth);
  //read
  useEffect(() => {
    if (user) {
      onValue(ref(db), (snapshot) => {
        setTodos([]);
        const data = snapshot.val();
        if (data !== null) {
          Object.values(data).map((todo) => {
            if (todo.userid === user.uid)
              setTodos((old) => [...old, todo]);
          });
        }
      });
    } else setTodos([]);
  }, [user]);

  const handleInput = (e) => {
    setTodo(e.target.value);
  };

  //write
  const writeToDatabase = () => {
    const uuid = uid();
    set(ref(db, `/${uuid}`), {
      todo,
      uuid,
      userid: user.uid,
    });
    setTodo("");
  };

  //update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUuid(todo.uuid);
  };

  const handleSubmitChange = () => {
    update(ref(db, `/${tempUuid}`), {
      todo,
      uuid: tempUuid,
    });
    setTodo("");
    setIsEdit(false);
  };

  //delete

  const handleDelete = (todo) => {
    remove(ref(db, `${todo.uuid}`));
  };
  const provider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem("name", result.user.displayName);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          width: "80vw",
          margin: "auto",
        }}
      >
        <h1>Welcome {user?.displayName}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <button
            onClick={signInWithGoogle}
            className="login-with-google-btn"
            style={{ marginRight: "1rem" }}
          >
            Sign In
          </button>{" "}
          <br />
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              signOut(auth);
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          width: "80vw",
          margin: "auto",
        }}
      >
        {user ? (
          <>
            <TextField
              id="standard-basic"
              label="Enter a Todo"
              variant="standard"
              onChange={handleInput}
              value={todo}
              style={{ width: "40%" }}
            />
            {isEdit ? (
              <>
                <Button onClick={handleSubmitChange}>Submit </Button>
                <Button
                  onClick={() => {
                    setIsEdit(false);
                    setTodo("");
                  }}
                >
                  X
                </Button>
              </>
            ) : (
              <Button disabled={!todo} variant="text" onClick={writeToDatabase}>
                Submit
              </Button>
            )}
          </>
        ) : (
          <h1>Please Login To Add a Todo</h1>
        )}
      </div>
      {todos.map((todo) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            width: "80vw",
            margin: "auto",
          }}
        >
          <h1>{todo.todo}</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={() => handleUpdate(todo)}>
              <EditIcon style={{ color: "#757575" }} />
            </Button>
            <IconButton onClick={() => handleDelete(todo)} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ))}
    </>
  );
}

export default App;
