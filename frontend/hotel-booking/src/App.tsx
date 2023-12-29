import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Registre from "./pages/Registre";
import SignIn from "./pages/SignIn";

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Layout><p>Home Page</p></Layout>}/>
        <Route path="/search" element={<Layout><p>Search Page</p></Layout>}/>
        <Route path="/register" element={<Layout><Registre/></Layout>}/>
        <Route path="/sign-in" element={<Layout><SignIn/></Layout>}/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  )
}

export default App;
