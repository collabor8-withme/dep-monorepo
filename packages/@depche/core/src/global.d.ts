type Config = {
    PKG_JSON_DIR: string,
    NODE_MODULES_DIR: string,
    PKG_MANAGER: string,
    DEPTH: number
}

type DepNode = {
    id: string,
    dependence: string,
    version: string,
    level: number
}

type DepRel = {
    source: string,
    target: string
}

declare class DepGraph {
    nodes: Array<DepNode>
    edges: Array<DepRel>
    constructor();
}

declare class DepAnlz {
    constructor();
    preHook(): Config;
    coreHook(config: Config): DepGraph;
    postHook(callback: (depGraph: DepGraph) => any): any;
    lifeCycle(): DepGraph;
}

export {
    Config,
    DepGraph,
    DepAnlz
}