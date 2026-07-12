import { batmobile } from "./batmobile.js";
import { millenniumFalcon } from "./millennium-falcon.js";

export const legoSets = Object.freeze([millenniumFalcon, batmobile]);

const setsByRoute = new Map(
  legoSets.flatMap((set) => [
    [set.id, set],
    [set.route, set],
  ]),
);

export const defaultLegoSet = millenniumFalcon;

export function resolveLegoSet({
  search = location.search,
  pathname = location.pathname,
} = {}) {
  const querySet = new URLSearchParams(search).get("set");
  if (querySet && setsByRoute.has(querySet)) return setsByRoute.get(querySet);

  const pathSet = pathname
    .split("/")
    .filter(Boolean)
    .reverse()
    .find((segment) => setsByRoute.has(segment));

  return setsByRoute.get(pathSet) || defaultLegoSet;
}

export function resolveSetFromHref(href, base = location.href) {
  const url = new URL(href, base);
  const querySet = url.searchParams.get("set");
  if (querySet && setsByRoute.has(querySet)) return setsByRoute.get(querySet);
  return defaultLegoSet;
}

export function getSetHref(set, pathname = location.pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const activeRouteIndex = segments.findIndex((segment) =>
    legoSets.some((candidate) => candidate.route === segment),
  );

  if (activeRouteIndex >= 0) segments.splice(activeRouteIndex);
  else if (segments.at(-1)?.includes(".")) segments.pop();

  const base = segments.length ? `/${segments.join("/")}/` : "/";
  if (set.id === defaultLegoSet.id) return base;
  return `${base}?set=${encodeURIComponent(set.route)}`;
}
