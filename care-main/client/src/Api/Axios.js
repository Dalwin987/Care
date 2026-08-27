import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      "REQUEST:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );

    return config;
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      "RESPONSE:",
      response.status,
      response.config.url
    );

    return response;
  },
  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data
    );

    return Promise.reject(error);
  }
);

export default api;