#!/usr/bin/env node
import {log, error} from "../lib/console"
import { version } from '../package.json';

const args = process.argv.slice(2)
const command = args[0]

function printHelp() {
    log(`\n🔍depanlz version ${version}`);
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
    log(`🔍depanlz v${version}`);
}
else if (command === undefined || command === "-h" || command === "--help") {
    printHelp();
}
else {
    error("Unkonwn command " + command);
}
