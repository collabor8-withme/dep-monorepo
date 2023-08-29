import { DepAnlz } from '@depche/core'
import { log, success } from "./console"
import { version } from '../package.json';
import { UnkonwnCommandError } from './Error'
const args = process.argv.slice(2);
const input = args[0]
const globalOptions = ["-V", "--version", "-h", "--help"]
const commands = [undefined, "analyze"]

function printHelp() {
    success('\n==================================');
    success(`🔍depanlz version ${version}`);
    success('==================================\n');
    log('Usage: depanlz <command> [options]\n');
    log("Global Options:");
    log('   -V, --version                          Show the version number');
    log('   -h, --help                             Display help for command\n');
    log('Commands:');
    log('   analyze [options]                      Analyze dependencies for your project');
}

const flag = globalOptions.includes(input) || commands.includes(input)

try {
    if (!flag) throw new UnkonwnCommandError("pleast --help command unknown")
} catch (e) {
    console.log(e)
}

if (input === "-h" || input === "--help" || input === undefined) printHelp()
if (input === "-V" || input === "--version") log(`🔍depanlz v${version}`)

if (input === "analyze") {
    log("⚙️ 开始分析依赖");
    const depGraph = new DepAnlz().lifeCycle()
    console.log(depGraph)
}

