/**
 * Tab memory store — remembers the last visited sub-path per root tab.
 * Stored in module-level object so it persists across renders without causing re-renders.
 */
const tabMemory = {
  '/': '/',
  '/menu': '/menu',
  '/cart': '/cart',
  '/track-order': '/track-order',
};

export const TAB_ROOTS = ['/', '/menu', '/cart', '/track-order'];

/** Returns the root tab for a given pathname, or null if not under any tab */
export function getRootTab(pathname) {
  if (pathname === '/') return '/';
  for (const root of TAB_ROOTS) {
    if (root !== '/' && pathname.startsWith(root)) return root;
  }
  return null;
}

export function getTabPath(root) {
  return tabMemory[root] ?? root;
}

export function setTabPath(root, pathname) {
  tabMemory[root] = pathname;
}