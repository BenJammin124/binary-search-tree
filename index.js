class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor() {
    this.root = null;
  }
  //Remove duplicates and sort array.
  buildTree(array) {
    array = Array.from(new Set(array));

    const sortedArray = array.sort((a, b) => a - b);
    this.root = this.sortedArrayToBST(sortedArray);
    return this.root;
  }

  sortedArrayToBST(array) {
    if (array.length === 0) {
      return null;
    }

    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);

    node.left = this.sortedArrayToBST(array.slice(0, mid));
    node.right = this.sortedArrayToBST(array.slice(mid + 1));

    return node;
  }

  insert(value) {
    this.root = this.insertRec(this.root, value);
  }

  insertRec(root, value) {
    if (root === null) {
      return new Node(value);
    }
    if (root.data === value) {
      console.log("Value already in tree");
      return root;
    }
    if (root.data < value) {
      root.right = this.insertRec(root.right, value);
    } else if (root.data > value) {
      root.left = this.insertRec(root.left, value);
    }

    return root;
  }

  deleteItem(value) {
    this.deleteItemRec(this.root, value);
    return this.root;
  }

  deleteItemRec(root, value) {
    if (root === null) {
      return root;
    }

    if (value < root.data) {
      root.left = this.deleteItemRec(root.left, value);
    } else if (value > root.data) {
      root.right = this.deleteItemRec(root.right, value);
    } else {
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }

      root.data = this.minValue(root.right);
      root.right = this.deleteItemRec(root.right, root.data);
    }
    return root;
  }

  minValue(node) {
    let minV = node.data;
    while (node.left !== null) {
      minV = node.left.data;
      node = node.left;
    }
    return minV;
  }

  find(value) {
    return this.findHelper(this.root, value);
  }

  findHelper(root, value) {
    if (root === null) {
      console.log("Nothing here");
      return root;
    }
    if (root.data === value) {
      return root;
    } else if (root.data > value) {
      root = this.findHelper(root.left, value);
    } else if (root.data < value) {
      root = this.findHelper(root.right, value);
    }
    return root;
  }

  levelOrder(callback) {
    let root = this.root;
    if (root === null) {
      return [];
    }
    let queue = [root];
    let result = [];

    while (queue.length > 0) {
      root = queue[0];
      if (callback) {
        callback(root);
      }
      result.push(root.data);

      if (root.left !== null) {
        queue.push(root.left);
      }
      if (root.right !== null) {
        queue.push(root.right);
      }
      queue.shift();
    }
    return callback ? undefined : result;
  }

  preOrder(callback) {
    let result = [];
    this.preOrderHelper(this.root, callback, result);
    return callback ? undefined : result;
  }

  preOrderHelper(root, callback, result) {
    if (root === null) return;
    if (callback) {
      callback(root);
    }
    result.push(root.data);

    this.preOrderHelper(root.left, callback, result);
    this.preOrderHelper(root.right, callback, result);
  }

  inOrder(callback) {
    let result = [];
    this.inOrderHelper(this.root, callback, result);
    return callback ? undefined : result;
  }

  inOrderHelper(root, callback, result) {
    if (root === null) return;
    this.inOrderHelper(root.left, callback, result);
    if (callback) {
      callback(root);
    }
    result.push(root.data);
    this.inOrderHelper(root.right, callback, result);
  }

  postOrder(callback) {
    let result = [];
    this.postOrderHelper(this.root, callback, result);
    return callback ? undefined : result;
  }

  postOrderHelper(root, callback, result) {
    if (root === null) return;
    this.postOrderHelper(root.left, callback, result);
    this.postOrderHelper(root.right, callback, result);
    if (callback) {
      callback(root);
    } else {
      result.push(root.data);
    }
  }

  heightOf(node) {
    let height = -1;

    const findHeightUtil = (root, x) => {
      if (root === null) {
        return -1;
      }

      const leftHeight = findHeightUtil(root.left, x);
      const rightHeight = findHeightUtil(root.right, x);
      const ans = Math.max(leftHeight, rightHeight) + 1;

      if (root.data === x) {
        height = ans;
      }

      return ans;
    };

    findHeightUtil(this.root, node);
    return height;
  }

  depth(node) {
    return this.depthHelper(this.root, node);
  }

  depthHelper(root, node) {
    if (root === null) return -1;
    if (root.data === node) return 0;
    let leftDepth = this.depthHelper(root.left, node);
    let rightDepth = this.depthHelper(root.right, node);

    if (leftDepth === -1 && rightDepth === -1) return -1;
    return Math.max(leftDepth, rightDepth) + 1;
  }

  isBalanced() {
    const root = this.root;
    const isBalancedHelper = (root) => {
      if (root === null) return 0;
      const leftHeight = isBalancedHelper(root.left);
      if (leftHeight === -1) {
        return -1;
      }
      const rightHeight = isBalancedHelper(root.right);
      if (rightHeight === -1) {
        return -1;
      }
      if (Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
      } else {
        return Math.max(rightHeight, leftHeight) + 1;
      }
    };
    if (isBalancedHelper(root) > 0) {
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }
  }

  rebalance() {
    const newArray = this.levelOrder();
    const newTree = this.buildTree(newArray);

    return newTree;
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const randomArr = (numbers) => {
  const thisArr = [];
  for (let i = 0; i <= numbers; i++) {
    thisArr.push(Math.floor(Math.random() * 100) + 1);
  }
  return thisArr;
};

const driver = (numbers) => {
  const arr = randomArr(numbers);
  const tree = new Tree();
  tree.buildTree(arr);
  tree.isBalanced();
  console.log("Level order: " + tree.levelOrder());
  console.log("Pre order: " + tree.preOrder());
  console.log("Post order: " + tree.postOrder());
  console.log("In order: " + tree.inOrder());
  tree.insert(101);
  tree.insert(102);
  tree.insert(106);
  tree.insert(105);
  tree.insert(104);
  tree.isBalanced();
  console.log(tree.rebalance());
  tree.isBalanced();
  console.log("In order: " + tree.inOrder());
};

// const array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// let tree = new Tree();
// tree.insert(10);
// tree.insert(5);
// tree.insert(12);
// tree.insert(6);
// tree.insert(4);
// prettyPrint(tree.root);
// tree.buildTree(array);
