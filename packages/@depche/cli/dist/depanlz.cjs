'use strict';

var core = require('@depche/core');

var RESET = "\x1b[0m";
var RED = "\x1b[31m";
var GREEN = "\x1b[32m";
function red(str) {
    return RED + str + RESET;
}
function green(str) {
    return GREEN + str + RESET;
}

function log(message) {
    console.log(message);
}
function success(message) {
    console.log(green(message));
}

var version = "0.0.1-rca";

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

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var UnkonwnCommandError = /** @class */ (function (_super) {
    __extends(UnkonwnCommandError, _super);
    function UnkonwnCommandError(message) {
        var _this = _super.call(this, red(message)) || this;
        _this.name = "UnkonwnCommandError";
        return _this;
    }
    return UnkonwnCommandError;
}(Error));

var args = process.argv.slice(2);
var input = args[0];
var globalOptions = ["-V", "--version", "-h", "--help"];
var commands = [undefined, "analyze"];
function printHelp() {
    success('\n==================================');
    success("\uD83D\uDD0Ddepanlz version ".concat(version));
    success('==================================\n');
    log('Usage: depanlz <command> [options]\n');
    log("Global Options:");
    log('   -V, --version                          Show the version number');
    log('   -h, --help                             Display help for command\n');
    log('Commands:');
    log('   analyze [options]                      Analyze dependencies for your project');
}
var flag = globalOptions.includes(input) || commands.includes(input);
try {
    if (!flag)
        throw new UnkonwnCommandError("pleast --help command unknown");
}
catch (e) {
    console.log(e);
}
if (input === "-h" || input === "--help" || input === undefined)
    printHelp();
if (input === "-V" || input === "--version")
    log("\uD83D\uDD0Ddepanlz v".concat(version));
if (input === "analyze") {
    log("⚙️ 开始分析依赖");
    var depGraph = new core.DepAnlz().lifeCycle();
    console.log(depGraph);
}
