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

function isArrContainObj(arr: Array<DepNode>, obj: DepNode): boolean {
    return arr.some(node => node.dependence === obj.dependence);
}

class DepGraph {
    nodes: Array<DepNode>
    edges: Array<DepRel>

    constructor() {
        this.nodes = []
        this.edges = []
    }

    insertNode(dependence: string, version: string, level: number) {
        const node: DepNode = {
            id: dependence + version,
            dependence,
            version,
            level
        }
        !isArrContainObj(this.nodes, node) && this.nodes.push(node)
    }

    // insertEgde(dependence, version, fromNode) {
        // const edge = {
        //     source: fromNode,
        //     target: dependence + version
        // }

        // this.edges.push(edge)
    // }
}

export default DepGraph