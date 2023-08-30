import * as fs from "fs"
import * as path from "path"
import DepGraph from "../DepGraph"
import { Config } from "../global";

const depGraph: DepGraph = new DepGraph();

function recursiveDep4YarnAndNpm(
    dependencies: { [key: string]: string },
    sourceId: string,
    config: Config,
    level: number = 1,
    processedDeps: Set<string> = new Set()) {
    for (const depName in dependencies) {

        const { NODE_MODULES_DIR, DEPTH } = config

        if (level === DEPTH + 1) {
            return
        }

        if (processedDeps.has(depName)) {
            continue
        }
        processedDeps.add(depName)

        // 记录目标节点
        const targetId = depName + dependencies[depName]

        depGraph.insertNode(depName, dependencies[depName], level)
        depGraph.insertEgde(sourceId, targetId)
        const nestedPkgJson = path.join(NODE_MODULES_DIR, depName, "package.json");
        const content = fs.readFileSync(nestedPkgJson, {
            encoding: "utf-8"
        });

        const { dependencies: dep } = JSON.parse(content)
        recursiveDep4YarnAndNpm(dep, targetId, config, level + 1, processedDeps)

        processedDeps.delete(depName)
    }
}

function coreHook(config: Config) {

    const { PKG_JSON_DIR, PKG_MANAGER, } = config

    if (PKG_MANAGER === "yarn" || "npm") {
        const content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        const { dependencies, name, version } = JSON.parse(content);
        const sourceId = name + version || ""
        depGraph.insertNode(name, version, 0)
        recursiveDep4YarnAndNpm(dependencies, sourceId, config)
    }

    // no finish
    if (PKG_MANAGER === "pnpm") {
        const content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        const { dependencies } = JSON.parse(content);
    }

    return depGraph
}



export default coreHook