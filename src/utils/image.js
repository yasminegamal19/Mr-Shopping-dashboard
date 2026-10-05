export const fixImageUrl = (url) => {
  if (!url) return "";
  const idx = url.lastIndexOf("http");
  return idx > 0 ? url.slice(idx) : url;
};