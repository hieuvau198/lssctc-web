import { BrowserRouter } from "react-router";
import MainRoutes from "./app/routes/MainRoutes/MainRoutes";

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  )
}

export default App;