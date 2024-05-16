import { useReducer, useRef } from "react";
import Post from "./Post";

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  inputValue: '',
  isEditing: false
};

const types = {
  DELETE: 'delete',
  EDIT: 'edit',
  MAKEPOST: 'makepost',
  COMPLETE: 'complete',
  SETINPUT: 'setinput',
}

function reducer(state, action) {
  switch (action.type) {
    case types.DELETE:
      const tasksAfterDelete = state.tasks.filter((post) => post.id !== action.id);
      localStorage.setItem("tasks", JSON.stringify(tasksAfterDelete));
      return { ...state, tasks: tasksAfterDelete };

    case types.EDIT:
      return { ...state, isEditing: action.isEditing, currentPostId: action.id };

    case types.MAKEPOST:
      if (state.inputValue.length > 0) {
        if (state.isEditing) {
          const tasksAfterEdit = state.tasks.map((task) =>
            task.id === state.currentPostId ? { ...task, text: state.inputValue } : task
          );
          localStorage.setItem("tasks", JSON.stringify(tasksAfterEdit));
          return { ...state, tasks: tasksAfterEdit, isEditing: false, inputValue: "" };
        } else {
          const newTask = {
            id: getID(),
            text: state.inputValue,
            date: getDate(),
            complete: false
          };
          const tasksWithNewPost = [newTask, ...state.tasks];
          localStorage.setItem("tasks", JSON.stringify(tasksWithNewPost));
          return {
            ...state,
            tasks: tasksWithNewPost,
            inputValue: ""
          };
        }
      }
      return state;

    case types.COMPLETE:
      const updatedTasks = state.tasks.map(task =>
        task.id === action.id ? { ...task, isComplete: !task.isComplete } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return { ...state, tasks: updatedTasks };

    case types.SETINPUT:
      return { ...state, inputValue: action.value };

    default:
      console.warn('Attempted to use an undefined action type');
      return state;
  }
}

const getDate = () => {
  return new Date().toLocaleDateString();
};

const getID = () => {
  return Date.now();
}

function ToDo() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputRef = useRef(null);

  const setInput = (e) => {
    dispatch({ type: types.SETINPUT, value: e.target.value });
  }

  const makePost = () => {
    dispatch({ type: types.MAKEPOST });
  }

  const deletePost = (id) => {
    dispatch({ type: types.DELETE, id });
  }

  const editPost = (id, text) => {
    dispatch({ type: types.EDIT, isEditing: true, id });
    dispatch({ type: types.SETINPUT, value: text });
    inputRef.current.focus();
  };
  
  const completePost = (id) => {
    dispatch({ type: types.COMPLETE, id });
  }

  return (
    <section>
      <div className="form">
      <input 
        type="text" 
        value={state.inputValue} 
        onChange={setInput} ref={inputRef} 
        placeholder="Add task"
      />
      <input 
        type="button" 
        onClick={makePost} 
        value= "Submit"
      />
      </div>
      <div className="posts">
        {state.tasks.map((post) => (
          <Post
            key={post.id}
            text={post.text}
            date={post.date}
            isComplete={post.isComplete}
            delete={() => deletePost(post.id)}
            edit={() => editPost(post.id, post.text)}
            complete={() => completePost(post.id, post.text)}
          />
        ))}
      </div>
    </section>
  );
}

export default ToDo;
