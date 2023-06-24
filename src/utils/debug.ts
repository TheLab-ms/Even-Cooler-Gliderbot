export function debugLog(...props: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...props);
  }
}
