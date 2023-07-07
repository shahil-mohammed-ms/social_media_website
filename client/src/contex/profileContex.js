import React, { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState({});

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
