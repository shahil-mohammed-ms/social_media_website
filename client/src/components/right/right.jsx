import React, { useEffect, useState } from "react";
import "../right/right.css";
import Post from "./post/Post";
import axios from "../../axios";

function Right() {
  return (
    <section className="right">
      <div className="posts">
        <Post />
      </div>
      <div className="friends"></div>
    </section>
  );
}

export default Right;
