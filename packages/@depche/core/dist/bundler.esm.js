import * as path from 'path';
import { join } from 'path';
import * as fs from 'fs';
import http from 'http';

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
    return arr.some(function (node) { return node.depName === obj.depName; });
}
var DepGraph = /** @class */ (function () {
    function DepGraph() {
        this.Nodes = [];
        this.Edges = [];
    }
    DepGraph.prototype.insertNode = function (dependence, version, category) {
        var node = {
            name: dependence + version,
            depName: dependence,
            value: version,
            category: category
        };
        !isArrContainObj(this.Nodes, node) && this.Nodes.push(node);
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
        var nestedPkgJson = path.join(NODE_MODULES_DIR, depName, "package.json");
        var content = fs.readFileSync(nestedPkgJson, {
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
        var content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        var rootDep = JSON.parse(content).dependencies;
        recursiveDep4YarnAndNpm(rootDep, NODE_MODULES_DIR);
    }
    if (PKG_MANAGER === "pnpm") {
        var content = fs.readFileSync(PKG_JSON_DIR, {
            encoding: "utf-8"
        });
        JSON.parse(content).dependencies;
    }
    return depGraph;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function webServerPostHook(depGraph) {
    var categories = [
        { name: 'depth1', color: '#ff6e76', symbolSize: 100 },
        { name: 'depth2', color: '#4992ff', symbolSize: 70 },
        { name: 'depth3', color: '#7cffb2', symbolSize: 50 },
        { name: 'depth4', color: '#8d48e3', symbolSize: 30 },
        { name: 'depth5', color: '#58d9f9', symbolSize: 20 },
        { name: 'depth6', color: '#05c091', symbolSize: 15 },
        { name: 'depth7', color: '#ff8a45', symbolSize: 10 },
    ];
    var option = {
        title: {
            text: "test depanlz",
            left: "center"
        },
        color: ['#ff6e76', '#4992ff', '#7cffb2', '#8d48e3', '#58d9f9', '#05c091', '#ff8a45'],
        legend: {
            right: 0,
            orient: 'vertical',
            textStyle: {
                color: "white"
            },
            padding: 20,
            itemWidth: 30,
            itemHeight: 15,
            data: ["depth1", "depth2", "depth3", "depth4", "depth5", "depth6", "depth7"]
        },
        darkMode: true,
        backgroundColor: "#100C2A",
        series: [
            {
                type: 'graph',
                layout: 'force',
                force: {
                    edgeLength: 300,
                    repulsion: 4000,
                    gravity: 0.1
                },
                draggable: true,
                roam: true,
                edgeSymbol: ["none", "arrow"],
                edgeSymbolSize: [4, 10],
                label: {
                    show: true,
                    rotate: 0,
                    formatter: "{b} {@value}"
                },
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    }
                },
                lineStyle: {
                    width: 0.5,
                    curveness: 0.3,
                    opacity: 0.7
                },
                categories: categories.map(function (category) { return ({ name: category.name }); }),
                nodes: depGraph.Nodes.map(function (node) { return (__assign(__assign({}, node), { symbolSize: categories[node.category].symbolSize, itemStyle: { color: categories[node.category].color } })); }),
                edges: depGraph.Edges,
            }
        ]
    };
    var str = JSON.stringify(option, null, 2);
    http.createServer(function (req, res) {
        var html = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n</head>\n<style>\nhtml, body {\n    margin: 0;\n    padding: 0;\n    width: 100vw;\n    height: 100vh;\n}\n\n#container {\n    width: 100%;\n    height: 100%;\n}\n</style>\n<body>\n    <div id=\"container\"></div>\n    <script src=\"https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js\"></script>\n    <script>\n                const myChart = echarts.init(document.getElementById('container'));\n                myChart.showLoading();\n                myChart.hideLoading();\n                const option = ".concat(str, "\n                myChart.setOption(option);\n                console.log(echarts)\n    </script>\n</body>\n</html>\n            ");
        res.end(html);
    }).listen(3000, function () {
        console.log("http://localhost:3000");
    });
}

var DepAnlz = /** @class */ (function () {
    function DepAnlz(webServer) {
        this.webServer = false;
        this.webServer = webServer;
    }
    DepAnlz.prototype.preHook = function () {
        return preHook();
    };
    DepAnlz.prototype.coreHook = function (config) {
        return coreHook(config);
    };
    DepAnlz.prototype.postHook = function (depGraph) {
        webServerPostHook(depGraph);
    };
    DepAnlz.prototype.lifeCycle = function () {
        var config = this.preHook();
        var depGraph = this.coreHook(config);
        if (this.webServer) {
            this.postHook(depGraph);
        }
        return depGraph;
    };
    return DepAnlz;
}());

export { DepAnlz };
