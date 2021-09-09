import { Button, IconButton, makeStyles, TextField } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "./SimpleDialog";
import SimpleTable from "./SimpleTable";

const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:5000";

const useStyles = makeStyles((theme) => ({
  blueButton: {
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#3880ff",
    margin: theme.spacing(2),
    height: "53px",
    "&:hover": {
      background: "grey",
    },
  },
  spacing: {
    margin: theme.spacing(2),
  },
}));

const EmployeeData = () => {
  const [employees, setEmployees] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100000);
  const [minSalaryError, setMinSalaryError] = useState("");
  const [maxSalaryError, setMaxSalaryError] = useState("");

  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [offset, setOffset] = useState(0);

  const [openPopup, setOpenPopup] = useState(false);
  const [editedEmployeeId, setEditedEmployeeId] = useState("");
  const [editedEmployeeLogin, setEditedEmployeeLogin] = useState("");
  const [editedEmployeeName, setEditedEmployeeName] = useState("");
  const [editedEmployeeSalary, setEditedEmployeeSalary] = useState("");
  const [editedEmployeeSalaryError, setEditedEmployeeSalaryError] =
    useState("");

  const fetchEmployees = () => {
    const sign = sortOrder === "asc" ? "+" : "-";
    axios
      .get(
        `${API_SERVER_URL}/users/?minSalary=${minSalary}&maxSalary=${maxSalary}&offset=${offset}&limit=${limit}&sort=${sign}${sortBy}`
      )
      .then((res) => {
        if (res.status === 200) {
          setTotalPageCount(Math.ceil(res.data.results.count / limit));
          setEmployees(res.data.results.rows);
        }
      });
  };

  const deleteEmployee = (id) => {
    axios.delete(`${API_SERVER_URL}/users/${id}`).then((res) => {
      if (res.status === 200) {
        fetchEmployees();
        if (employees.length <= 1 && currPage > 1) {
          previousPage();
        }
      }
    });
  };

  const editEmployee = () => {
    const employee = {
      id: editedEmployeeId,
      login: editedEmployeeLogin,
      name: editedEmployeeName,
      salary: editedEmployeeSalary,
    };
    axios.patch(`${API_SERVER_URL}/users`, employee).then((res) => {
      if (res.status === 200) {
        fetchEmployees();
      }
    });
  };

  const nextPage = () => {
    if (currPage < totalPageCount) {
      setCurrPage(currPage + 1);
      setOffset(offset + limit);
    }
  };

  const previousPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
      setOffset(Math.max(offset - limit, 0));
    }
  };

  const requestSort = (pSortBy) => {
    let newSortOrder = sortOrder;
    let newSortBy = sortBy;
    let newLimit = limit;
    let newOffset = offset;
    let newPageCount = currPage;

    return () => {
      if (pSortBy === sortBy) {
        newSortOrder = newSortOrder === "asc" ? "desc" : "asc";
      } else {
        newSortBy = pSortBy;
        newSortOrder = "asc";
        newLimit = 30;
        newOffset = 0;
        newPageCount = 1;
      }

      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setLimit(newLimit);
      setOffset(newOffset);
      setCurrPage(newPageCount);
    };
  };

  const showPopup = (id, login, name, salary) => {
    setEditedEmployeeId(id);
    setEditedEmployeeLogin(login);
    setEditedEmployeeName(name);
    setEditedEmployeeSalary(salary);
    setEditedEmployeeSalaryError("");
    setOpenPopup(true);
  };

  const handleSubmitRange = (e) => {
    e.preventDefault();

    if (!isNaN(minSalary) && minSalary >= 0) {
      setMinSalaryError("");
    } else {
      setMinSalaryError("Invalid minimum salary!");
      return;
    }

    if (!isNaN(maxSalary) && parseFloat(maxSalary) >= parseFloat(minSalary)) {
      setMaxSalaryError("");
    } else {
      setMaxSalaryError("Invalid maximum salary!");
      return;
    }

    setOffset(0);
    setCurrPage(1);
    fetchEmployees();
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();

    if (!isNaN(editedEmployeeSalary) && parseFloat(editedEmployeeSalary) >= 0) {
      setEditedEmployeeSalaryError("");
    } else {
      setEditedEmployeeSalaryError("Invalid Salary!");
      return;
    }

    editEmployee();

    setOpenPopup(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [sortBy, sortOrder, limit, offset]);

  const classes = useStyles();

  const returnTable = () => {
    if (!employees || !employees.length) {
      return <h3>No Employees Found!</h3>;
    }

    return (
      <>
        <div className={classes.spacing}>
          <IconButton onClick={previousPage}>
            <ArrowBackIosIcon color="#000" />
          </IconButton>
          {currPage} / {totalPageCount}{" "}
          <IconButton onClick={nextPage}>
            <ArrowForwardIosIcon color="#000" />
          </IconButton>
        </div>
        <SimpleTable
          employees={employees}
          sortOrder={sortOrder}
          sortBy={sortBy}
          requestSort={requestSort}
          deleteEmployee={deleteEmployee}
          showPopup={showPopup}
        />
      </>
    );
  };

  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">Employee Table</h4>
      <form onSubmit={handleSubmitRange}>
        <div>
          <TextField
            onChange={(e) => setMinSalary(e.target.value)}
            className={classes.spacing}
            required
            id="filled-required"
            label="Minimum Salary ($)"
            defaultValue="0"
            variant="filled"
            helperText={minSalaryError}
            error={minSalaryError}
          />
          <TextField
            onChange={(e) => setMaxSalary(e.target.value)}
            className={classes.spacing}
            required
            id="filled-required"
            label="Maximum Salary ($)"
            defaultValue="100000"
            variant="filled"
            helperText={maxSalaryError}
            error={maxSalaryError}
          />
        </div>
        <Button className={classes.blueButton} type="submit">
          Submit Range
        </Button>
      </form>
      {returnTable()}
      <Popup
        title="Edit Employee"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <form onSubmit={handleSubmitEmployee}>
          <div>
            <TextField
              onChange={(e) => setEditedEmployeeLogin(e.target.value)}
              className={classes.spacing}
              required
              id="filled-required"
              defaultValue={editedEmployeeLogin}
              label="Login"
              variant="filled"
            />
          </div>
          <div>
            <TextField
              onChange={(e) => setEditedEmployeeName(e.target.value)}
              className={classes.spacing}
              required
              id="filled-required"
              defaultValue={editedEmployeeName}
              label="Name"
              variant="filled"
            />
          </div>
          <div>
            <TextField
              onChange={(e) => setEditedEmployeeSalary(e.target.value)}
              className={classes.spacing}
              required
              id="filled-required"
              defaultValue={editedEmployeeSalary}
              label="Salary ($)"
              variant="filled"
              helperText={editedEmployeeSalaryError}
              error={editedEmployeeSalaryError}
            />
          </div>
          <Button className={classes.blueButton} type="submit">
            Save Changes
          </Button>
        </form>
      </Popup>
    </div>
  );
};

export default EmployeeData;
