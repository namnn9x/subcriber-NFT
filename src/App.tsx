import { Routes, Route } from "react-router-dom"
import './App.css';
import { AuthenProvider } from './providers/Authenticator';
import Signin from "./containers/Signin";
import Signout from "./containers/Signout";
import Signup from "./containers/Signup";

function App() {
  return (
    <div className="App">
      <AuthenProvider>
        <Routes>
          <Route>
            <Route path="signin" element={<Signin />} />
            <Route path="signout" element={<Signout />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </AuthenProvider>
    </div>
  );
}

export default App;
