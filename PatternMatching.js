class TreeNode {
    constructor(data, parent) {
        this.data = data;
        this.parent = parent;
        this.children = [];
    }
}
class Tree {
    addNode(value, pNode) {
        let currNode = new TreeNode();
        currNode.data = value;
        currNode.parent = pNode;
        if (pNode !== null) { //if not dummyHead
            for (parentSibling of pNode.children) {
                if (parentSibling.data === value) {
                    return parentSibling;
                }
            }
            pNode.children.push(currNode);
        }
        return currNode;
    }
    printNode(node) {
        if (node.children.length === 0) {
            console.log("ServerFound: " + node.data);
            return;
        }
        console.log("Parent: " + node.data)
        if (node.children.length !== 0) {
            console.log("Children:")
            for (cNode of node.children) {
                console.log(cNode.data)
            }
            for (cNode of node.children) {
                this.printNode(cNode);
            }
        }
    }
    searchNode(route, pNode) {
        for (cNode of pNode.children) {
            if (cNode.data === route[0]) {
                route.shift();
                if (route.length === 0) {
                    return cNode.children[0].data;
                }
                return this.searchNode(route, cNode);
            }
        }
        route.shift(); // if area not found, replace with *
        route.unshift("*");
        return this.searchNode(route, pNode)
    }
}

let tree = new Tree();
let treeRoot = tree.addNode("dummyHead", null);

function loadConfig() {
    let rulesInput = "customer1.us.ca.*=server1,customer2.us.*.*=server3,customer2.*.*.*=server4,*.*.*.*=server5,customer1.us.ca.sjc=server2";
    let rules = rulesInput.split(",");
    let rulesFractured = [];
    for (rule of rules) {
        let currRule = rule.split("=").join(".").split(".")
        rulesFractured.push(currRule);
    }
    //build tree from dummyHead
    for (oneRule of rulesFractured) {
        buildTreeBranch(treeRoot, oneRule);
    }
    // tree.printNode(treeRoot);
}

function buildTreeBranch(pNode, strings) {
    let cNode = tree.addNode(strings[0], pNode);
    strings.shift();
    if (strings.length !== 0) {

        buildTreeBranch(cNode, strings);
    }
}
loadConfig();


function findRoute(input) {
    let inputFractured = input.split(".");
    return tree.searchNode(inputFractured, treeRoot);
}
//test
console.log(findRoute("customer1.us.ca.sfo"));
console.log(findRoute("customer1.us.ca.sjc"));
console.log(findRoute("customer2.us.tx.dfw"));
console.log(findRoute("customer2.cn.tw.tai"));
console.log(findRoute("customer10.us.ny.nyc"));
