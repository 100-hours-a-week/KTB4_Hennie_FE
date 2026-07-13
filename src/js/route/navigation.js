let renderRoute = null;

export const registerRouteRenderer = (renderer) => {
  renderRoute = renderer;
};

export const navigate = (path, { replace = false } = {}) => {
  const historyMethod = replace ? "replaceState" : "pushState";

  history[historyMethod](null, "", path);

  if (!renderRoute) {
    window.dispatchEvent(new CustomEvent("app:navigate"));
    return;
  }

  return renderRoute();
};
