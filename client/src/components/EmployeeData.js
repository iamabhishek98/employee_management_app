import { Button, IconButton, makeStyles, TextField } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SimpleTable from "./SimpleTable";

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
  const DEFAULT_LIMIT = 2; // supposed to be 30

  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState("id"); // id, login, name, salary
  const [sortOrder, setSortOrder] = useState("asc"); // + or -
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100000);
  const [minSalaryError, setMinSalaryError] = useState(false);
  const [maxSalaryError, setMaxSalaryError] = useState(false);

  const [totalPageCount, setTotalPageCount] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const fetchUsers = () => {
    const sign = sortOrder === "asc" ? "+" : "-";
    axios
      .get(
        `http://localhost:5001/users/?minSalary=${minSalary}&maxSalary=${maxSalary}&offset=${offset}&limit=${limit}&sort=${sign}${sortBy}`
      )
      .then((res) => {
        setTotalPageCount(Math.ceil(res.data.results.count / limit));
        setUsers(res.data.results.rows);
      });
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:5001/users/${id}`).then((res) => {
      if (res.data.status === "success") {
        fetchUsers();
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
        newLimit = DEFAULT_LIMIT;
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

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortOrder, limit, offset]);

  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isNaN(minSalary) && minSalary >= 0) {
      setMinSalaryError(false);
    } else {
      setMinSalaryError(true);
      return;
    }

    if (!isNaN(maxSalary) && parseFloat(maxSalary) >= parseFloat(minSalary)) {
      setMaxSalaryError(false);
    } else {
      setMaxSalaryError(true);
      return;
    }

    setOffset(0);
    setCurrPage(1);
    fetchUsers();
  };

  const returnTable = () => {
    if (!users || !users.length) {
      return <h3>No Employees Found!</h3>;
    }

    return (
      <>
        <div className={classes.spacing}>
          <IconButton onClick={previousPage}>
            <ArrowBackIosIcon color="#000" />
          </IconButton>
          {currPage}{" "}
          <IconButton onClick={nextPage}>
            <ArrowForwardIosIcon color="#000" />
          </IconButton>
        </div>
        <SimpleTable
          users={users}
          sortOrder={sortOrder}
          sortBy={sortBy}
          requestSort={requestSort}
          deleteUser={deleteUser}
        />
      </>
    );
  };

  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">Employee Table</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            onChange={(e) => setMinSalary(e.target.value)}
            className={classes.spacing}
            required
            id="filled-required"
            label="Minimum Salary ($)"
            defaultValue="0"
            variant="filled"
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
            error={maxSalaryError}
          />
        </div>
        <Button className={classes.blueButton} type="submit">
          Submit Range
        </Button>
      </form>
      {returnTable()}
    </div>
  );
};

export default EmployeeData;
