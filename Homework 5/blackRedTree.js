/*
    HOMEWORK:
        Develop realisation of black-red tree, it should have the next functions:  
         - Add element to the tree.
         - Remove element from a tree.
         - Find element on a tree.
         - Get max and min depth in a tree.
*/

class Node{
    constructor(element){
        this.data = element;
        this.color = 'R';
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class BlackRedTree{
    constructor(){
        this.root = null;
    }

    add(element){
        const newNode = new Node(element);

        if(!this.root){
            newNode.color = 'B';
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }

        if(newNode.parent !== null){  //checks if newNode has been actually inserted or if it was a repeated value/root.
            this.insertFixer(newNode);
        }
    }

    //recursive function to search the tree and insert new node in the right position
    insertNode(tree, newNode){
        if(tree === null){
            tree = newNode;
        } else {
            if(tree.data !== newNode.data){
                if(newNode.data < tree.data){
                    tree.left = this.insertNode(tree.left, newNode);
                    tree.left.parent = tree;
                } else {
                    tree.right = this.insertNode(tree.right, newNode);
                    tree.right.parent = tree;
                }
            }
        }

        return tree;
    }

    //to fix the balance of the tree after insertion
    insertFixer(newNode){
        while(newNode.parent !=null && newNode.parent.color === 'R'){
            let p = newNode.parent;
            let gp = newNode.parent.parent;

            if(p === gp.left){ //if p is left child of gp.
                if(gp.right!==null && gp.right.color === 'R'){ //if uncle exists and is red -> set color of gp as red and its children's color as black and assign gp as newNode
                    gp.color = 'R';
                    gp.right.color = 'B';
                    p.color = 'B';
                    newNode = gp;
                } else { //if uncle doesn't exists or is black ->
                    if(newNode === p.right){ //if newNode is right child of p -> assign p to newNode and LeftRotate newNode
                        newNode = p;
                        this.rotateLeft(newNode);
                    } else { //else if newNode is left child of p -> set p as black and gp as red and RightRotate gp.
                        p.color = 'B';
                        gp.color = 'R';
                        this.rotateRight(gp);
                    }
                }
            } else { //else p is right child of gp.
                if(gp.left!==null && gp.left.color === 'R'){  //if uncle exists and is red -> set color of gp as red and its children's color as black and assign gp as newNode
                    gp.color = 'R';
                    gp.left.color = 'B';
                    p.color = 'B';
                    newNode = gp;
                } else { //if uncle doesn't exists or is black ->
                    if(newNode === p.left){ //if newNode is left child of p -> assign p to newNode and RightRotate newNode
                        newNode = p;
                        this.rotateRight(newNode);
                    } else { //else if newNode is right child of p -> set p as black and gp as red and LeftRotate gp.
                        p.color = 'B';
                        gp.color = 'R';
                        this.rotateLeft(gp);
                    }
                }
            }
        }
        
        //set color of root as black
        this.root.color = 'B';
    }


    /*Left-Rotation
        node               x
           \              /
            x    ==>   node
           /              \
         "y"              "y"
    */
    rotateLeft(node) {
        let x = node.right;
        node.right = x.left;
        if (x.left !== null) {
          x.left.parent = node;
        }
        x.parent = node.parent;
        if (node.parent === null) {
          this.root = x;
        } else if (node === node.parent.left) {
          node.parent.left = x;
        } else {
          node.parent.right = x;
        }
        x.left = node;
        node.parent = x;
    }
    
    /*Right-Rotation
        node         x
        /             \
       x      ==>     node
        \             /
        "y"         "y"
    */
    rotateRight(node) {
        let x = node.left;
        node.left = x.right;
        if (x.right !== null) {
          x.right.parent = node;
        }
        x.parent = node.parent;
        if (node.parent === null) {
          this.root = x;
        } else if (node === node.parent.right) {
          node.parent.right = x;
        } else {
          node.parent.left = x;
        }
        x.right = node;
        node.parent = x;
    }

    remove(element){
        let node = this.find(this.root, element);
    
        if(node){ //if element's node was found
            let x;

            if(node.left === null){ //case: node has 1 or 0 child
                x = node.right;
                this.transplant(node, x);
            } else if (node.right === null) { //case: node has 1 child
                x = node.left;
                this.transplant(node, x);
            } else {
                let x = this.minimum(node.right); //Assign the minimum of right subtree of node into x.
                if (x.parent === node){  //case: node has both children and sucessor is node.right.
                    x.left = node.left;
                    x.left.parent = x;
                } else { //case: node has both children and sucessor is not its direct child.
                    if(x.right){ //case: x already has a right child (it can't have a left child)
                        x.right.parent = x.parent;
                        x.parent.left = x.right;
                    }
    
                    x.left = node.left; //assigned node left child to x
                    x.left.parent = x;
    
                    x.right = node.right; //assigned node right child to x
                    x.right.parent = x;
                }
                this.transplant(node, x);
            }

            if((x && x.color === 'B') && (x.parent && x.parent.color === 'B')){
                this.deleteFixer(x.parent);
            }
        }
    }

    //v takes the place of u
    transplant(u, v){
        if (u.parent === null) {
            this.root = v;
          } else if (u == u.parent.left) {
            u.parent.left = v;
          } else {
            u.parent.right = v;
          }
          if(v){
            v.parent = u.parent;
          }
    }

    //to get its inorder successor (leftmost node in the right subtree)
    minimum(node){
        if(node.left === null){
            return node;
        } else {
            return this.minimum(node.left);
        }
    }

    //Recursive function to fix double black conflict after removing an element.
    deleteFixer(node) {
        if (node === this.root) { //finish fixing the tree
          return;
        }

        let p = node.parent;
        let s = (node === p.left) ? p.right : p.left;
      
        if (s === null) { //if no sibling, goes to check node.parent
            this.deleteFixer(p);
        } else {
            if (s.color === 'R') { //if sibling is red, rotate and recolor.
                p.color = 'R';
                s.color = 'B';
      
                if (s === p.left) { //Left case
                    this.rotateRight(p);
                } else { //Right case
                    this.rotateLeft(p);
                }
                this.deleteFixer(node);
            } else { //else slibing is black
                if ((s.left != null && s.left.color === 'R') || (s.right != null && s.right.color === 'R')) { //s has 1+ red children
                    if (s.left !== null && s.left.color === 'R') { // if left child of sibling is red
                        if (s === p.left) { // if sibling is left child -> Left-Left case
                            s.left.color = s.color;
                            s.color = p.color;
                            this.rotateRight(p);
                        } else { // if sibling is right child -> Right-Left case
                            s.left.color = p.color;
                            this.rotateRight(s);
                            this.rotateLeft(p);
                        }
                    } else { // if right child of sibling is red or both are red
                        if (s === p.left) { // if sibling is left child -> Left-Right case
                            s.right.color = p.color;
                            this.rotateLeft(s);
                            this.rotateRight(p);
                        } else { // if sibling is right child -> Right-Right case
                            s.right.color = s.color;
                            s.color = p.color;
                            this.rotateLeft(p);
                        }
                    }
            
                    p.color = 'B';
                } else { // else both children are black
                    s.color = 'R';
        
                    if (p.color === 'B') {
                        this.deleteFixer(p);
                    } else {
                        p.color = 'B';
                    }
                }
            }
        }
    }

    find(tree, element){
        if(tree === null || tree.data === element){
            return tree;
        } else {
            if(element < tree.data){
                return this.find(tree.left, element);
            } else {
                return this.find(tree.right, element);
            }
        }
    }

    maxDepth(){
        if(tree === null){
            return 0;
        } else {
            const Ldepth = 1 + this.maxDepth(tree.left);
            const Rdepth = 1 + this.maxDepth(tree.right);
            if(Ldepth >= Rdepth){
                return Ldepth;
            } else {
                return Rdepth;
            }
        }
    }

    minDepth(tree){
        if(tree === null){
            return 0;
        } else {
            const Ldepth = 1 + this.minDepth(tree.left);
            const Rdepth = 1 + this.minDepth(tree.right);
            if(Ldepth <= Rdepth){
                return Ldepth;
            } else {
                return Rdepth;
            }
        }
    }

    showPreorder(tree){
        if(tree){
            console.log(tree.data);
            this.showPreorder(tree.left);
            this.showPreorder(tree.right);
        }
    }

    showInorder(tree){
        if(tree){
            this.showInorder(tree.left);
            console.log(tree.data + tree.color);
            console.log(tree);
            this.showInorder(tree.right);
        }
    }

    showPostorder(tree){
        if(tree){
            this.showInorder(tree.left);
            this.showInorder(tree.right);
            console.log(tree.data);
        }
    }
}

myTree = new BlackRedTree();

myTree.add(8);
myTree.add(8);
myTree.add(18);
myTree.add(5);
myTree.add(5);
myTree.add(15);
myTree.add(17);
myTree.add(25);
myTree.add(40);
myTree.add(80);

//myTree.showInorder(myTree.root);
console.log(myTree.root.data);

myTree.remove(40);
myTree.remove(25);
myTree.remove(80);
myTree.remove(17);
myTree.remove(8);
myTree.remove(5);
myTree.remove(18);
myTree.remove(15);
myTree.showInorder(myTree.root);
console.log(myTree.root);
