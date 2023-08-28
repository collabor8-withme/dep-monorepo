'use strict';

var reset = "\x1b[0m";
var red = "\x1b[31m";
function log(message) {
    console.log(message);
    return undefined;
}
function error(message) {
    console.log(red + message + reset);
    return undefined;
}

var version = "0.0.1-alpha";

var args = process.argv.slice(2);
var command = args[0];
function printHelp() {
    log("\n\uD83D\uDD0Ddepanlz version ".concat(version));
    log('==================================\n');
    log('Usage: depanlz <command> [options]\n');
    log("Global Options:");
    log('   -V, --version                          Show the version number');
    log('   -h, --help                             Display help for command\n');
    log('Commands:');
    log('   analyze [options]                      Analyze dependencies for your project');
}
if (command === "analyze") {
    log("dep analying");
}
else if (command === "-v") {
    log("\uD83D\uDD0Ddepanlz v".concat(version));
}
else if (command === undefined || command === "-h" || command === "--help") {
    printHelp();
}
else {
    error("Unkonwn command " + command);
}
