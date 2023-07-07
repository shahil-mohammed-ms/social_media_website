import React, { useEffect, useState } from "react";
import "../pages/Home.css";
import Sidebar from "../components/sidebar/sidebar";
import Right from "../components/right/right";
import axios from "../axios";
import { useProfileContext } from "../contex/profileContex";

function Home() {
  const { profile, setProfile } = useProfileContext();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profileDetails = await axios.get("/profileDetails", {
          withCredentials: true,
        });

        setProfile(profileDetails.data);
      } catch (e) {
        console.log(e);
      }
    };
    getProfile();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <Right />
    </div>
  );
}

export default Home;
