'use strict';

var core = require('@depche/core');

var version = "0.0.1-rcc.1";

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

var RESET = "\x1b[0m";
var RED = "\x1b[31m";
var GREEN = "\x1b[32m";
function red(str) {
    return RED + str + RESET;
}
function green(str) {
    return GREEN + str + RESET;
}

var UnkonwnCommandError = /** @class */ (function (_super) {
    __extends(UnkonwnCommandError, _super);
    function UnkonwnCommandError(message) {
        var _this = _super.call(this, red(message)) || this;
        _this.name = "UnkonwnCommandError";
        return _this;
    }
    return UnkonwnCommandError;
}(Error));

function log(message) {
    console.log(message);
}
function success(message) {
    console.log(green(message));
}

function globalConsole(version) {
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

function analyzeConsole() {
    success('\n==================================');
    success("\uD83D\uDD0Ddepanlz analyze");
    success('==================================\n');
    log('Usage: depanlz analyze [options]\n');
    log("Options:");
    log('   -j, --json                             Show the version number');
    log('   -h, --help                             Display help for command');
    log('   -w, --web                              Start a web server for check dependencies\n');
}

function analyze(argument) {
    var help = argument[0];
    var jsonFlag = argument.includes("-j") || argument.includes("--json");
    var webFlag = argument.includes("-w") || argument.includes("--web");
    if (help === "-h" || help === "--help") {
        return analyzeConsole();
    }
    var depGraph = new core.DepAnlz().lifeCycle();
    if (jsonFlag && !webFlag) {
        console.log("json");
        console.log(JSON.stringify(depGraph));
    }
    else if (webFlag && !jsonFlag) {
        console.log("web");
    }
    else if (jsonFlag && webFlag) {
        console.log("json and web");
    }
    else {
        console.log("no json no web");
        console.log(depGraph);
    }
}

var args = process.argv.slice(2);
var input = args[0];
var argument = process.argv.slice(3);
var globalOptions = ["-V", "--version", "-h", "--help"];
var commands = [undefined, "analyze"];
var flag = globalOptions.includes(input) || commands.includes(input);
try {
    if (!flag)
        throw new UnkonwnCommandError("(!) You have passed an unrecognized command");
}
catch (e) {
    console.log(e);
}
if (input === "-h" || input === "--help" || input === undefined)
    globalConsole(version);
if (input === "-V" || input === "--version")
    console.log("\uD83D\uDD0Ddepanlz v".concat(version));
if (input === "analyze") {
    analyze(argument);
}
