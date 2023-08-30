import { DepAnlz } from '@depche/core'
import { webServer } from "@depche/web-server"
import analyzeConsole from '../console/analyzeConsole'

function analyze(argument: Array<string>) {
    const options = ["-h", "--help", "-j", "--json", "-w", "--web", "-d", "--depth"]

    const help = argument[0]
    if (help === "-h" || help === "--help") {
        return analyzeConsole()
    }

    let depth;
    if (argument.indexOf("-d") !== -1) {
        depth = parseInt(argument[argument.indexOf("-d") + 1])
    } else if (argument.indexOf("--depth") !== -1) {
        depth = parseInt(argument[argument.indexOf("--depth") + 1])
    }

    const jsonFlag = argument.includes("-j") || argument.includes("--json")
    const webFlag = argument.includes("-w") || argument.includes("--web")

    const depanlz = new DepAnlz()
    const depGraph = depanlz.lifeCycle()

    if (jsonFlag && !webFlag) {

        console.log(JSON.stringify(depGraph))

    } else if (webFlag && !jsonFlag) {

        depanlz.postHook(webServer)

    } else if (jsonFlag && webFlag) {

        console.log("json and web")

    } else {

        console.log(depGraph)
    }

}

export {
    analyze
}