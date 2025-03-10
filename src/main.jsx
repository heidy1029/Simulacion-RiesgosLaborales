import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Juegos from './Juegos.jsx'
import ListaJuegos from './ListaJuegos.jsx'
import Board from './components/tres-en-linea/Board.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
 
  {
    path: "/:nombreJuego/:oids",
    element: <ListaJuegos />
  },
  {
    path: "/:tipoJuego/:oidJuego/:oidUsuario",
    element: <Juegos />
  },
  {
    path: "/triki",
    element: <Board />
  }
], { basename: '/juegos'});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
