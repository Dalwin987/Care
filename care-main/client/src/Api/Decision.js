import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("accesstoken");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data ||
        error.message
    );

    return Promise.reject(error);
  }
);

// ==========================================
// REQUEST API
// ==========================================

export const requestApi = {

  getAll: (params = {}) =>
    api.get("/decisions", {
      params,
    }),

  getOne: (id) =>
    api.get(`/decisions/${id}`),

  create: (data) =>
    api.post("/decisions", data),

  getStats: () =>
    api.get("/decisions/stats"),

  accept: (id) =>
    api.patch(
      `/decisions/${id}/accept`
    ),

  reject: (id) =>
    api.patch(
      `/decisions/${id}/reject`
    ),

  update: (id, data) =>
    api.put(
      `/decisions/${id}`,
      data
    ),

  delete: (id) =>
    api.delete(
      `/decisions/${id}`
    ),

  bulkAccept: (ids) =>
    api.patch(
      "/decisions/bulk/accept",
      { ids }
    ),

  bulkReject: (ids) =>
    api.patch(
      "/decisions/bulk/reject",
      { ids }
    ),
};

export default api;