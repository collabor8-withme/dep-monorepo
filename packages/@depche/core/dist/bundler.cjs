'use strict';

var path = require('path');
var fs = require('fs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

function isFileExists(filePath) {
    try {
        fs__namespace.accessSync(filePath, fs__namespace.constants.F_OK);
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
var PKG_JSON_DIR = path.join(CWD, "package.json");
var NODE_MODULES_DIR = path.join(CWD, "node_modules");
var NPM_LOCK_DIR = path.join(CWD, "package-lock.json");
var YARN_LOCK_DIR = path.join(CWD, "yarn.lock");
var PNPM_LOCK_DIR = path.join(CWD, "pnpm-lock.yaml");
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
function preHook() {
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
        PKG_MANAGER: PKG_MANAGER
    };
    return config;
}

function isArrContainObj(arr, obj) {
    return arr.some(function (node) { return node.dependence === obj.dependence; });
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
    return DepGraph;
}());

var depGraph = new DepGraph();
function recursiveDep4YarnAndNpm(rootDep, NODE_MODULES_DIR, level, processedDeps) {
    if (level === void 0) { level = 0; }
    if (processedDeps === void 0) { processedDeps = new Set(); }
    for (var depName in rootDep) {
        if (processedDeps.has(depName)) {
            continue;
        }
        processedDeps.add(depName);
        depGraph.insertNode(depName, rootDep[depName], level);
        var nestedPkgJson = path__namespace.join(NODE_MODULES_DIR, depName, "package.json");
        var content = fs__namespace.readFileSync(nestedPkgJson, {
            encoding: "utf-8"
        });
        var childDep = JSON.parse(content).dependencies;
        recursiveDep4YarnAndNpm(childDep, NODE_MODULES_DIR, level + 1, processedDeps);
        processedDeps.delete(depName);
    }
}
function coreHook(config) {
    var PKG_JSON_DIR = config.PKG_JSON_DIR, NODE_MODULES_DIR = config.NODE_MODULES_DIR, PKG_MANAGER = config.PKG_MANAGER;
    if (PKG_MANAGER === "yarn" || "npm") {
        var content = fs__namespace.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        var rootDep = JSON.parse(content).dependencies;
        recursiveDep4YarnAndNpm(rootDep, NODE_MODULES_DIR);
    }
    if (PKG_MANAGER === "pnpm") {
        var content = fs__namespace.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        JSON.parse(content).dependencies;
    }
    return depGraph;
}

var DepAnlz = /** @class */ (function () {
    function DepAnlz() {
    }
    DepAnlz.prototype.preHook = function () {
        return preHook();
    };
    DepAnlz.prototype.coreHook = function (config) {
        return coreHook(config);
    };
    DepAnlz.prototype.postHook = function (callback) {
        var result = callback(this.lifeCycle());
        return result;
    };
    DepAnlz.prototype.lifeCycle = function () {
        var config = this.preHook();
        var depGraph = this.coreHook(config);
        return depGraph;
    };
    return DepAnlz;
}());

exports.DepAnlz = DepAnlz;
