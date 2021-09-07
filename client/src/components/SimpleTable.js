import {
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      textAlign: "center",
    },
  },
  tableContainer: {
    borderRadius: 5,
    margin: "auto",
    maxWidth: 950,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    color: theme.palette.getContrastText("#3880ff"),
    backgroundColor: "#3880ff",
    // backgroundColor: "#3880ff",
    // "&:hover": {
    //   backgroundColor: "#98CCFB",
    // },
  },
}));

const SimpleTable = (props) => {
  const classes = useStyles();
  if (!props.users) return <></>;

  const editIcon = (
    <IconButton>
      <EditIcon color="primary" />
    </IconButton>
  );

  var deleteIcon = (
    <IconButton>
      <DeleteIcon color="secondary" />
    </IconButton>
  );

  return (
    <React.Fragment>
      <Paper className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>
                <TableSortLabel
                  active={props.sortBy === "id"}
                  direction={props.sortOrder}
                  onClick={props.requestSort("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                <TableSortLabel
                  active={props.sortBy === "login"}
                  direction={props.sortOrder}
                  onClick={props.requestSort("login")}
                >
                  Login
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                <TableSortLabel
                  active={props.sortBy === "name"}
                  direction={props.sortOrder}
                  onClick={props.requestSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>
                <TableSortLabel
                  active={props.sortBy === "salary"}
                  direction={props.sortOrder}
                  onClick={props.requestSort("salary")}
                >
                  Salary
                </TableSortLabel>
              </TableCell>
              <TableCell className={classes.tableHeaderCell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.users.map((item, indx) => {
              return (
                <TableRow key={indx}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.login}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>$ {item.salary}</TableCell>
                  <TableCell>
                    {editIcon}
                    <span onClick={() => props.deleteUser(item.id)}>
                      {deleteIcon}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter />
        </Table>
      </Paper>
    </React.Fragment>
  );
};

export default SimpleTable;
