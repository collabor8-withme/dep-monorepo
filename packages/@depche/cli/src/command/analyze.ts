import { DepAnlz } from '@depche/core'
import { webServer } from "@depche/web-server"
import analyzeConsole from '../console/analyzeConsole'

function analyze(argument: Array<string>) {
    const options = ["-h", "--help", "-j", "--json", "-w", "--web", "-d", "--depth"]

    const help = argument[0]
    const jsonFlag = argument.includes("-j") || argument.includes("--json")
    const webFlag = argument.includes("-w") || argument.includes("--web")

    if (help === "-h" || help === "--help") {
        return analyzeConsole()
    }

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