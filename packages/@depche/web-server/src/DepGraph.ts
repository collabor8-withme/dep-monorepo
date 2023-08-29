type DepNode = {
    name: string,
    depName: string,
    value: string,
    category: number
}

type DepRel = {
    source: string,
    target: string
}

function isArrContainObj(arr: Array<DepNode>, obj: DepNode): boolean {
    return arr.some(node => node.depName === obj.depName);
}

class DepGraph {
    Nodes: Array<DepNode>
    Edges: Array<DepRel>

    constructor() {
        this.Nodes = []
        this.Edges = []
    }

    insertNode(dependence: string, version: string, category: number) {
        const node: DepNode = {
            name: dependence + version,
            depName: dependence,
            value: version,
            category
        }

        !isArrContainObj(this.Nodes, node) && this.Nodes.push(node)
    }

    // insertEgde(depName, version, fromNode) {
        // const edge = {
        //     source: fromNode,
        //     target: depName + version
        // }

        // this.edges.push(edge)
    // }
}

export default DepGraph