import http from "http"
import DepGraph from "../DepGraph";

function webServerPostHook
(depGraph: DepGraph) {
    const categories = [
        { name: 'depth1', color: '#ff6e76', symbolSize: 100 },
        { name: 'depth2', color: '#4992ff', symbolSize: 70 },
        { name: 'depth3', color: '#7cffb2', symbolSize: 50 },
        { name: 'depth4', color: '#8d48e3', symbolSize: 30 },
        { name: 'depth5', color: '#58d9f9', symbolSize: 20 },
        { name: 'depth6', color: '#05c091', symbolSize: 15 },
        { name: 'depth7', color: '#ff8a45', symbolSize: 10 },
    ];

    const option = {
        title: {
            text: "test depanlz",
            left: "center"
        },
        color: ['#ff6e76', '#4992ff', '#7cffb2', '#8d48e3', '#58d9f9', '#05c091', '#ff8a45'],
        legend: {
            right: 0,
            orient: 'vertical',
            textStyle: {
                color: "white"
            },
            padding: 20,
            itemWidth: 30,
            itemHeight: 15,
            data: ["depth1", "depth2", "depth3", "depth4", "depth5", "depth6", "depth7"]
        },
        darkMode: true,
        backgroundColor: "#100C2A",
        series: [
            {
                type: 'graph',
                layout: 'force',
                force: {
                    edgeLength: 300,
                    repulsion: 4000,
                    gravity: 0.1
                },
                draggable: true,
                roam: true,
                edgeSymbol: ["none", "arrow"],
                edgeSymbolSize: [4, 10],
                label: {
                    show: true,
                    rotate: 0,
                    formatter: "{b} {@value}"
                },
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    }
                },
                lineStyle: {
                    width: 0.5,
                    curveness: 0.3,
                    opacity: 0.7
                },
                categories: categories.map(category => ({ name: category.name })),
                nodes: depGraph.Nodes.map(node => ({
                    ...node,
                    symbolSize: categories[node.category].symbolSize,
                    itemStyle: { color: categories[node.category].color }
                })),
                edges: depGraph.Edges,
            }
        ]
    }

    const str = JSON.stringify(option, null, 2)

    http.createServer((req, res) => {

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
html, body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
}

#container {
    width: 100%;
    height: 100%;
}
</style>
<body>
    <div id="container"></div>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <script>
                const myChart = echarts.init(document.getElementById('container'));
                myChart.showLoading();
                myChart.hideLoading();
                const option = ${str}
                myChart.setOption(option);
                console.log(echarts)
    </script>
</body>
</html>
            `;
        res.end(html)
    }).listen(3000, () => {
        console.log("http://localhost:3000")
    })
}

export default webServerPostHook



