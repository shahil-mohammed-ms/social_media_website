import React, { useState, useEffect } from "react";
import "./create_post.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

function Create_post() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("description", description);
      formData.append("title", title);

      await axios.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      navigate("/home");
      // Handle successful submission, e.g., show a success message or redirect
    } catch (error) {
      // Handle error, e.g., show an error message
    }
  };

  return (
    <div className="main-container">
      <div className="post-container">
        <form onSubmit={handleSubmit}>
          <div className="img-box">
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div className="box">
            <label htmlFor="files">Select Files:</label>
            <input
              className="file-input"
              type="file"
              id="files"
              name="files"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="box">
            <label htmlFor="title">Title:</label>
            <input
              className="tandd input"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="box">
            <label htmlFor="description">Description:</label>
            <input
              className="tandd input"
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Create_post;
