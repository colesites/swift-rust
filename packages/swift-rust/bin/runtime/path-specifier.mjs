import { posix, win32 } from "node:path";

export function isAbsoluteBuildPath(pathname) {
  return posix.isAbsolute(pathname) || win32.isAbsolute(pathname);
}

export function isLocalBuildSpecifier(pathname) {
  return (
    pathname.startsWith(".") ||
    pathname.startsWith("@/") ||
    isAbsoluteBuildPath(pathname)
  );
}

export function shouldExternalizeBuildSpecifier(pathname, kind) {
  return kind !== "entry-point-build" && !isLocalBuildSpecifier(pathname);
}
