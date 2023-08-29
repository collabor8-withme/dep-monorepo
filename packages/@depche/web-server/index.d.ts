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

declare function webServer(depGraph: DepGraph): any

export {
    DepGraph,
    webServer
} 