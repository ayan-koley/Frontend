import api from "./api.js";

const useMock = (import.meta.env.VITE_USE_MOCK || "false") === "true";

function getMockUrls() {
  return JSON.parse(localStorage.getItem("mock_urls") || "[]");
}
function setMockUrls(urls) {
  localStorage.setItem("mock_urls", JSON.stringify(urls));
}

export async function createUrl({ original, alias }) {
  const { data } = await api.post("/shorten/urls", { originalUrl: original }, {
    withCredentials: true
  });
  return data.data.url;
}

export async function listUrls() {
  const { data } = await api.get("/shorten/urls", {
    withCredentials: true
  });
  return data.data.urls;
}

export async function deleteUrl(id) {
  if (useMock || !api.defaults.baseURL) {
    const urls = getMockUrls().filter((u) => u.id !== id);
    setMockUrls(urls);
    return { success: true };
  }
  const { data } = await api.delete(`/url/${id}`);
  return data;
}

export async function disableUrl(id) {
  if (useMock || !api.defaults.baseURL) {
    const urls = getMockUrls().map((u) =>
      u.id === id ? { ...u, disabled: true } : u
    );
    setMockUrls(urls);
    return { success: true };
  }
  // Placeholder for backend route if available
  return { success: true };
}
