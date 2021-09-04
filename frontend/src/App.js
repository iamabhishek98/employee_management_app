import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import EmployeeData from "./components/EmployeeData";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={EmployeeData} />
        <Route exact path="/upload" component={FileUpload} />
      </Router>
    </div>
  );
}

export default App;
