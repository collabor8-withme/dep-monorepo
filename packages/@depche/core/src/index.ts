import preHook from "./hooks/preHook"

import { Config, DepGraph } from './global'
import coreHook from "./hooks/coreHook";
import webServerPostHook from "./hooks/webServerPostHook";

class DepAnlz {

    constructor(webServer: boolean) {
        this.webServer = webServer
    }

    webServer: boolean = false

    preHook() {
        return preHook();
    }

    coreHook(config: Config) {
        return coreHook(config);
    }

    postHook(depGraph: DepGraph) {
        webServerPostHook(depGraph)
    }

    lifeCycle() {
        const config = this.preHook();
        const depGraph = this.coreHook(config)
        if (this.webServer) {
            this.postHook(depGraph)
        }
        return depGraph
    }
}

export {
    DepAnlz
}

