import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store.js";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
// createRoot(document.getElementById('root')).render(

//   <StrictMode>

//     <App />
//   </StrictMode>
// );
