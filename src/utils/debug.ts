import env from "./env";

export function debugLog(...props: any[]) {
  if (env.NODE_ENV === 'DEV') {
    console.log(...props);
  }
}
