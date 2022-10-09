/* eslint-disable no-console */
import { execSync } from "child_process";
import { readFileSync } from "fs";

try {
  const packageJSON = readFileSync("./package.json", "utf8");
  const localVersion = JSON.parse(packageJSON).version;
  const npmVersion = execSync("npm view @jetvil/cm-api version").toString().trim() || "1.0.0";
  const split = npmVersion.split(".");
  const pkgSplit = localVersion.split(".");
  console.log(split, pkgSplit);

  // make sure that if the version is in the format 1.0.0-beta.1 it will still work
  if (split.length > 3) {
    console.log("npm version is in beta format");
    const betaSplit = split[3].split("-");
    const betaPkgSplit = pkgSplit[3].split("-");
    console.log(betaSplit, betaPkgSplit);

    if (betaSplit[0] >= betaPkgSplit[0]) {
      throw new Error("Version outdate");
    } else {
      console.log("Version is up to date");
      process.exit(0);
    }
  }
  if (
    split[0] > pkgSplit[0] ||
    (split[0] >= pkgSplit[0] && split[1] >= pkgSplit[1]) ||
    (split[0] >= pkgSplit[0] && split[1] >= pkgSplit[1] && split[2] >= pkgSplit[2])
  ) {
    if (split[0] > pkgSplit[0]) {
      throw new Error(`This major version is outdated, ${localVersion}`);
    } else if (split[0] >= pkgSplit[0] && split[1] > pkgSplit[1]) {
      throw new Error(`This minor version is outdated on this major version, ${localVersion}`);
    } else if (split[0] >= pkgSplit[0] && split[1] >= pkgSplit[1] && split[2] >= pkgSplit[2]) {
      throw new Error(`This patch version is outdated on this major+minor version, ${localVersion}`);
    } else {
      console.info("Your version of @jetvil/cm-api is up to date.");
    }
  }
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
