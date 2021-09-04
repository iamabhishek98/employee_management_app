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

  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const fetchUsers = () => {
    const sign = sortOrder === "asc" ? "+" : "-";
    axios
      .get(
        `http://localhost:5001/users/?minSalary=${minSalary}&maxSalary=${maxSalary}&offset=${offset}&limit=${limit}&sort=${sign}${sortBy}`
      )
      .then((res) => {
        setUsers(res.data.message);
      });
  };

  const nextPage = () => {
    setPageCount(pageCount + 1);
    setOffset(offset + limit);
  };

  const previousPage = () => {
    setPageCount(Math.max(pageCount - 1, 1));
    setOffset(Math.max(offset - limit, 0));
  };

  const requestSort = (pSortBy) => {
    let newSortOrder = sortOrder;
    let newSortBy = sortBy;
    let newLimit = limit;
    let newOffset = offset;

    return () => {
      if (pSortBy === sortBy) {
        newSortOrder = newSortOrder === "asc" ? "desc" : "asc";
      } else {
        newSortBy = pSortBy;
        newSortOrder = "asc";
        newLimit = DEFAULT_LIMIT;
        newOffset = 0;
      }

      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
      setLimit(newLimit);
      setOffset(newOffset);
    };
  };

  useEffect(() => {
    console.log("limit:", limit, "skip:", offset);
    fetchUsers();
  }, [sortBy, sortOrder, limit, offset]);

  const classes = useStyles();

  const handleSubmit = (e) => {
    console.log("hello");
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

    console.log("range", minSalary, maxSalary);
    setOffset(0);
    setPageCount(1);
    fetchUsers();
  };

  return (
    <div>
      <h1>Employee Data</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          onChange={(e) => setMinSalary(e.target.value)}
          className={classes.spacing}
          required
          id="filled-required"
          label="Minimum Salary"
          defaultValue="0"
          variant="filled"
          error={minSalaryError}
        />
        <TextField
          onChange={(e) => setMaxSalary(e.target.value)}
          className={classes.spacing}
          required
          id="filled-required"
          label="Maximum Salary"
          defaultValue="100000"
          variant="filled"
          error={maxSalaryError}
        />
        <Button className={classes.blueButton} type="submit">
          Submit Range
        </Button>
      </form>

      <div className={classes.spacing}>
        <IconButton>
          <ArrowBackIosIcon color="#000" onClick={previousPage} />
        </IconButton>
        {pageCount}{" "}
        <IconButton>
          <ArrowForwardIosIcon color="#000" onClick={nextPage} />
        </IconButton>
      </div>
      <SimpleTable
        users={users}
        sortOrder={sortOrder}
        sortBy={sortBy}
        requestSort={requestSort}
      />
    </div>
  );
};

export default EmployeeData;
