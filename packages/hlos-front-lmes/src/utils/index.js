export function debounce(fun, timeout = 100) {
  let timeId;
  return (...args) => {
    if (timeId) clearTimeout(timeId);
    timeId = setTimeout(() => {
      fun(...args);
      timeId = null;
    }, timeout);
  };
}
