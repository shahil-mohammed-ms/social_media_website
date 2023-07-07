import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Enable sending cookies with the request
});

export default instance;
