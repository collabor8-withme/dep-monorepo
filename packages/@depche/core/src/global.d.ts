type Config = {
    PKG_JSON_DIR: string,
    NODE_MODULES_DIR: string,
    PKG_MANAGER: string
}

declare class DepAnlz {
    constructor();
    constructor(webServer: boolean);
    webServer: boolean;
    preHook(): Config;
    coreHook(config: Config): DepGraph;
    postHook(depGraph: DepGraph): void;
    lifeCycle(): DepGraph;
  }

declare class DepGraph {
    Nodes: Array<DepNode>
    Edges: Array<DepRel>
    constructor();
    insertNode(dependence: string, version: string, category: number): void
    // insertEgde(depName, version, fromNode) {
    // const edge = {
    //     source: fromNode,
    //     target: depName + version
    // }
    // this.edges.push(edge)
    // }
}


export {
    Config,
    DepAnlz,
    DepGraph
}