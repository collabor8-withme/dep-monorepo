import preHook from "./hooks/preHook"

import { Config } from './global'
import coreHook from "./hooks/coreHook";

class DepAnlz {

    constructor() {}

    preHook() {
        return preHook();
    }

    coreHook(config: Config) {
        return coreHook(config);
    }

    lifeCycle() {
        const config = this.preHook();
        const depGraph = this.coreHook(config)
        return depGraph
    }
}

export {
    DepAnlz
}

