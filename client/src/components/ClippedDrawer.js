import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import PublishIcon from "@material-ui/icons/Publish";
import TableChartIcon from "@material-ui/icons/TableChart";
import React, { useState } from "react";
import EmployeeData from "./EmployeeData";
import EmployeeFileUpload from "./EmployeeFileUpload";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    textAlign: "center",
    backgroundColor: "#222222",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function ClippedDrawer() {
  const [employeeData, setEmployeeData] = useState(true);
  const [employeeFileUpload, setEmployeeFileUpload] = useState(false);

  const classes = useStyles();

  const showEmployeeData = () => {
    setEmployeeFileUpload(false);
    setEmployeeData(true);
  };

  const showEmployeeFileUpload = () => {
    setEmployeeData(false);
    setEmployeeFileUpload(true);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <h4>Employee Management Application</h4>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div>
          <ListItem button onClick={() => showEmployeeData()}>
            <ListItemIcon>
              <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="Employee Table" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => showEmployeeFileUpload()}>
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemText primary="Upload Data" />
          </ListItem>
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {employeeData && <EmployeeData />}
        {employeeFileUpload && <EmployeeFileUpload />}
      </main>
    </div>
  );
}
