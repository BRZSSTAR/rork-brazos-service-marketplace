export function redirectSystemPath({
  path,
  initial,
}: { path: string; initial: boolean }) {
  try {
    if (path && path.includes('/p/')) {
      return path;
    }
  } catch (error) {
    console.log('[NativeIntent] redirect error:', error);
  }
  return '/';
}
