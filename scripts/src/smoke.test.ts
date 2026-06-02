import { expect, test } from "bun:test";
import * as buildNative from "./build-native";
import * as publish from "./publish";
import * as syncErrors from "./sync-errors";
import * as testPack from "./test-pack";
import * as versionBump from "./version-bump";

test("scripts modules load", () => {
  expect(buildNative).toBeDefined();
  expect(publish).toBeDefined();
  expect(syncErrors).toBeDefined();
  expect(testPack).toBeDefined();
  expect(versionBump).toBeDefined();
});
