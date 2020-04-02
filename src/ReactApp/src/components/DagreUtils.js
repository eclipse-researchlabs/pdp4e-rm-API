import * as dagre from "dagre";
import * as _ from "lodash";

const size = {
	width: 60,
	height: 60
};

export function distributeElements(model) {
	let clonedModel = _.cloneDeep(model);
	let nodes = distributeGraph(clonedModel);
	let plus4index = 0;
	nodes.forEach((node, index) => {
		let modelNode = clonedModel.nodes.find(item => item.id === node.id);
		let extendReach = 0;
		if (modelNode.ports.length > 4) {
			extendReach = plus4index * 100;
			plus4index = plus4index + 1;
		}
		modelNode.x = node.x + (index * 100);
		//modelNode.y = node.y - node.height / 2;
		modelNode.y = node.y + extendReach;
	});
	return clonedModel;
}

function distributeGraph(model) {
	let nodes = mapElements(model);
	let edges = mapEdges(model);
	let graph = new dagre.graphlib.Graph();
	graph.setGraph({});
	graph.setDefaultEdgeLabel(() => ({}));
	//add elements to dagre graph
	nodes.forEach(node => {
		graph.setNode(node.id, node.metadata);
	});
	edges.forEach(edge => {
		if (edge.from && edge.to) {
			graph.setEdge(edge.from, edge.to);
		}
	});
	//auto-distribute
	dagre.layout(graph);
	return graph.nodes().map(node => graph.node(node));
}

function mapElements(model) {
	// dagre compatible format
	return model.nodes.map(node => ({ id: node.id, metadata: { ...size, id: node.id } }));
}

function mapEdges(model) {
	// returns links which connects nodes
	// we check are there both from and to nodes in the model. Sometimes links can be detached
	return model.links
		.map(link => ({
			from: link.source,
			to: link.target
		}))
		.filter(
			item => model.nodes.find(node => node.id === item.from) && model.nodes.find(node => node.id === item.to)
		);
}