// "user client";
import axios from "axios";

const ApiClient = (token?: any) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.request.use(async (request) => {
    // console.log(`session`, session);
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    // console.log(`request`, request.headers);
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    }
  );
  return instance;
};

export default ApiClient;
