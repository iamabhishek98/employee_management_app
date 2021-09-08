import { Button, makeStyles } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import Message from "./Message";
import Progress from "./Progress";

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
}));

const EmployeeFileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    if (e.target.files && e.target.files.length) {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a CSV file!");
      return;
    }

    const formData = new FormData();

    formData.append("file", new File([file], file.name, { type: "text/csv" }));
    try {
      const res = await axios.post(
        "http://localhost:5000/users/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          },
        }
      );

      setTimeout(() => setUploadPercentage(0), 10000);

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage("File Uploaded");
    } catch (err) {
      if (!err.response) {
        setMessage(
          "There was a problem with the server! Please reload this page and try again!"
        );
      } else {
        setMessage(err.response.data.error);
      }
      setUploadPercentage(0);
    }
  };

  const classes = useStyles();

  return (
    <div className="container mt-4">
      <h4 className="display-4 text-center mb-4">Employee Data File Upload</h4>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <Button className={classes.blueButton} type="submit">
          Upload
        </Button>
      </form>
      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} alt="" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EmployeeFileUpload;
