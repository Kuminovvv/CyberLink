// Tiny hash router
const routes = {};

export function route(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  if (location.hash !== `#/${path}`) location.hash = `#/${path}`;
  else render();
}

export async function render() {
  const hash = location.hash.replace(/^#\//, '') || 'home';
  const [path, ...params] = hash.split('/');
  const handler = routes[path] || routes['404'];
  const el = document.getElementById('app');
  el.innerHTML = '';
  await handler?.(el, params);
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}

