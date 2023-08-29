import { DepAnlz } from '@depche/core'
import analyzeConsole from '../console/analyzeConsole'

function analyze(argument: Array<string>) {
    const options = ["-h", "--help", "-j", "--json", "-w", "--web", "-d", "--depth"]

    const help = argument[0]
    const jsonFlag = argument.includes("-j") || argument.includes("--json")
    const webFlag = argument.includes("-w") || argument.includes("--web")

    if (help === "-h" || help === "--help") {
        return analyzeConsole()
    }

    const depGraph = new DepAnlz().lifeCycle()
    if (jsonFlag && !webFlag) {
        console.log("json")
        console.log(JSON.stringify(depGraph))
    } else if (webFlag && !jsonFlag) {
        console.log("web")
    } else if (jsonFlag && webFlag) {
        console.log("json and web")
    } else {
        console.log("no json no web")
        console.log(depGraph)
    }


}

export {
    analyze
}