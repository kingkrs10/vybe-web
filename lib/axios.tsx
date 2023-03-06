import axios from "axios";
import { getCurrentUser } from "./session";

const ApiClient = (token?: any) => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APIURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.request.use(async (request) => {
    if (token !== null && token !== undefined) {
      request.headers["Authorization"] = `Bearer ${token}`;
      // request.headers["Authorization"] = ``;
    } else if (token === null) {
      // const session = await getCurrentUser();
      // request.headers["Authorization"] = `Bearer ${token}`;
    } else {
      const session = await getCurrentUser();
      request.headers["Authorization"] = `Bearer ${session?.token}`;
    }
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
