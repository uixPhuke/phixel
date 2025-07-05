import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//import { store } from './store.js'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'


// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <Router>

//     <App />
//     </Router>
//   </Provider>
// );
    
createRoot(document.getElementById('root')).render(

  <StrictMode>

    <App />
  </StrictMode>
);
    
