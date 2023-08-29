import * as fs from "fs"
import * as path from "path"
import DepGraph from "../DepGraph"
import { Config } from "../global";

const depGraph: DepGraph = new DepGraph();

function recursiveDep4YarnAndNpm(
    rootDep: { [key: string]: string },
    NODE_MODULES_DIR: string,
    level: number = 0,
    processedDeps: Set<string> = new Set()) {
    for (const depName in rootDep) {

        if (processedDeps.has(depName)) {
            continue
        }
        processedDeps.add(depName)

        depGraph.insertNode(depName, rootDep[depName], level)
        const nestedPkgJson = path.join(NODE_MODULES_DIR, depName, "package.json");
        const content = fs.readFileSync(nestedPkgJson, {
            encoding: "utf-8"
        });
        const { dependencies: childDep } = JSON.parse(content)
        recursiveDep4YarnAndNpm(childDep, NODE_MODULES_DIR, level + 1, processedDeps)

        processedDeps.delete(depName)
    }
}

function coreHook(config: Config) {

    const { PKG_JSON_DIR, NODE_MODULES_DIR, PKG_MANAGER } = config

    if (PKG_MANAGER === "yarn" || "npm") {
        const content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        const { dependencies: rootDep } = JSON.parse(content);
        recursiveDep4YarnAndNpm(rootDep, NODE_MODULES_DIR)
    }

    if (PKG_MANAGER === "pnpm") {
        const content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        const { dependencies } = JSON.parse(content);
    }

    return depGraph
}



export default coreHook