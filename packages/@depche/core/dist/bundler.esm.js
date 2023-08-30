import * as path from 'path';
import { join } from 'path';
import * as fs from 'fs';

function isFileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    }
    catch (err) {
        return false;
    }
}

/**
 * preHook 钩子进行预检处理
 * 1. 检查是否从项目根目录启动（是否含有package.json文件）
 * 2. 检查是否已经下载完成依赖（是否含有node_modules目录）
 * 3. 检查使用的包管理器是什么（所含有的lock文件是什么类型）
 *
 * 返回package.json node_modules的绝对目录，以及包管理器名称
 */
var CWD = process.cwd();
var PKG_JSON_DIR = join(CWD, "package.json");
var NODE_MODULES_DIR = join(CWD, "node_modules");
var NPM_LOCK_DIR = join(CWD, "package-lock.json");
var YARN_LOCK_DIR = join(CWD, "yarn.lock");
var PNPM_LOCK_DIR = join(CWD, "pnpm-lock.yaml");
function detectPackageManager() {
    if (isFileExists(NPM_LOCK_DIR)) {
        return "npm";
    }
    else if (isFileExists(YARN_LOCK_DIR)) {
        return "yarn";
    }
    else if (isFileExists(PNPM_LOCK_DIR)) {
        return "pnpm";
    }
    return "";
}
function preHook(DEPTH) {
    if (!isFileExists(PKG_JSON_DIR)) {
        throw new Error("\u001B[31m\u5F53\u524D\u5DE5\u4F5C\u76EE\u5F55\u4E3A".concat(CWD, ",\u6CA1\u6709\u53D1\u73B0package.json\u001B[0m"));
    }
    if (!isFileExists(NODE_MODULES_DIR)) {
        throw new Error("not contain node_modules");
    }
    var PKG_MANAGER = detectPackageManager();
    if (!PKG_MANAGER) {
        throw new Error("lock file lose");
    }
    var config = {
        PKG_JSON_DIR: PKG_JSON_DIR,
        NODE_MODULES_DIR: NODE_MODULES_DIR,
        PKG_MANAGER: PKG_MANAGER,
        DEPTH: DEPTH
    };
    return config;
}

function isArrContainObj(arr, obj) {
    return arr.some(function (node) { return node.id === obj.id; });
}
var DepGraph = /** @class */ (function () {
    function DepGraph() {
        this.nodes = [];
        this.edges = [];
    }
    DepGraph.prototype.insertNode = function (dependence, version, level) {
        var node = {
            id: dependence + version,
            dependence: dependence,
            version: version,
            level: level
        };
        !isArrContainObj(this.nodes, node) && this.nodes.push(node);
    };
    DepGraph.prototype.insertEgde = function (fromNodeId, toNodeId) {
        var edge = {
            source: fromNodeId,
            target: toNodeId
        };
        if (edge.source !== "")
            this.edges.push(edge);
    };
    return DepGraph;
}());

var depGraph = new DepGraph();
function recursiveDep4YarnAndNpm(rootDep, sourceId, config, level, processedDeps) {
    if (level === void 0) { level = 1; }
    if (processedDeps === void 0) { processedDeps = new Set(); }
    for (var depName in rootDep) {
        var NODE_MODULES_DIR = config.NODE_MODULES_DIR, DEPTH = config.DEPTH;
        if (level === DEPTH + 1) {
            return;
        }
        if (processedDeps.has(depName)) {
            continue;
        }
        processedDeps.add(depName);
        var currentNodeId = depName + rootDep[depName];
        console.log(currentNodeId, rootDep);
        depGraph.insertNode(depName, rootDep[depName], level);
        depGraph.insertEgde(sourceId, currentNodeId);
        var nestedPkgJson = path.join(NODE_MODULES_DIR, depName, "package.json");
        var content = fs.readFileSync(nestedPkgJson, {
            encoding: "utf-8"
        });
        var childDep = JSON.parse(content).dependencies;
        recursiveDep4YarnAndNpm(childDep, currentNodeId, config, level + 1, processedDeps);
        processedDeps.delete(depName);
    }
}
function coreHook(config) {
    var PKG_JSON_DIR = config.PKG_JSON_DIR, PKG_MANAGER = config.PKG_MANAGER;
    if (PKG_MANAGER === "yarn" || "npm") {
        var content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        var _a = JSON.parse(content), rootDep = _a.dependencies, name_1 = _a.name, version = _a.version;
        recursiveDep4YarnAndNpm(rootDep, name_1 + version, config);
    }
    // no finish
    if (PKG_MANAGER === "pnpm") {
        var content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        JSON.parse(content).dependencies;
    }
    return depGraph;
}

var DepAnlz = /** @class */ (function () {
    function DepAnlz(depth) {
        this.depth = depth;
    }
    DepAnlz.prototype.preHook = function () {
        return preHook(this.depth);
    };
    DepAnlz.prototype.coreHook = function (config) {
        return coreHook(config);
    };
    DepAnlz.prototype.postHook = function (callback) {
        var config = preHook(this.depth);
        var depGraph = coreHook(config);
        var result = callback(config, depGraph);
        return result;
    };
    DepAnlz.prototype.lifeCycle = function () {
        var config = this.preHook();
        var depGraph = this.coreHook(config);
        return depGraph;
    };
    return DepAnlz;
}());

export { DepAnlz };
