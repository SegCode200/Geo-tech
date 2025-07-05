import { RouterProvider } from 'react-router-dom'
import mainRoute from './router/mainRoute'

function App() {


  return (
    <RouterProvider router={mainRoute}/>
  )
}

export default App
