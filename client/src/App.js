import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import ClippedDrawer from "./components/ClippedDrawer";
import EmployeeData from "./components/EmployeeData";
import EmployeeFileUpload from "./components/EmployeeFileUpload";

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" component={ClippedDrawer} />
        <Route exact path="/" component={EmployeeData} />
        <Route exact path="/upload" component={EmployeeFileUpload} />
      </Router>
    </div>
  );
}

export default App;
