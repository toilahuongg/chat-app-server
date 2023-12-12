const path = require("path");
const tsConfig = require("./tsconfig.json");
const tsConfigServer = require("./tsconfig.server.json");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = tsConfig.compilerOptions.baseUrl || ".";
const outDir = tsConfigServer.compilerOptions.outDir || ".";

const env = process.env.NODE_ENV;
let baseUrlPath;
if (env === "production" || env === "staging") {
  baseUrlPath = path.resolve(outDir, baseUrl);
} else {
  baseUrlPath = baseUrl;
}
tsConfigPaths.register({
  baseUrl: baseUrlPath,
  paths: tsConfig.compilerOptions.paths,
});
