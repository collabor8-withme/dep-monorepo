import { Config } from './global'
import preHook from "./hooks/preHook"
import coreHook from "./hooks/coreHook";
import DepGraph from './DepGraph';

class DepAnlz {

    constructor() {}

    preHook(): Config {
        return preHook();
    }

    coreHook(config: Config): DepGraph {
        return coreHook(config);
    }

    postHook (callback: (depGraph: DepGraph) => any) {
        const result =  callback(this.lifeCycle())
        return result
    }

    lifeCycle() {
        const config: Config = this.preHook();
        const depGraph: DepGraph = this.coreHook(config)
        return depGraph
    }
}

export {
    DepAnlz
}

