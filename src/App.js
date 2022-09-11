import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTask } from "./graphql/mutations";
import { listTasks } from "./graphql/queries";
import { Authenticator, Button, Heading, Alert } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

function App({ signOut, user }) {
  const [task, setTask] = useState({
    name: "",
    description: "",
  });
  const [tasks, setTasks] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(task);
    const result = await API.graphql(
      graphqlOperation(createTask, { input: task })
    );
    console.log(result);
  };

  useEffect(() => {
    async function loadTasks() {
      const result = await API.graphql(graphqlOperation(listTasks));
      setTasks(result.data.listTasks.items);
    }
    loadTasks();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <Alert variation="info">Welcome</Alert>

              <Heading level={1}>Hello {user.username}</Heading>
              <form onSubmit={handleSubmit}>
                <input
                  name=""
                  placeholder="Title"
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                  className="form-control"
                />
                <textarea
                  name="description"
                  placeholder="description"
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                  className="form-control"
                ></textarea>
                <button className="btn btn-primary">Submit</button>
              </form>

              {tasks.map((task) => {
                return (
                  <article className="card card-body">
                    <h3>{task.name}</h3>
                    <p>{task.description}</p>
                  </article>
                );
              })}

              <Button onClick={signOut}>Sign out</Button>
            </div>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
