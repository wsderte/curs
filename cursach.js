'use strict';

const RIGHT = 1;
const LEFT = 0;
const oppDir = dir => (dir === RIGHT ? LEFT : RIGHT);

class Binarytree {
  constructor(value) {
    this.value = value;
    this.children = [];
    this.parent = undefined;
  }
  get right() {
    return this.children[RIGHT];
  }
  get left() {
    return this.children[LEFT];
  }
  set right(value) {
    this.children[RIGHT] = value;
  }
  set left(value) {
    this.children[LEFT] = value;
  }
  get isRightChild() {
    return this.parent ? this.parent.right === this : false;
  }
  get isLeftChild() {
    return this.parent ? this.parent.left === this : false;
  }
  get isRoot() {
    return this.parent === undefined;
  }
  get  uncle() {
    if (!this.grandparent) {
      return undefined;
    }
    return this.parent.isRightChild ?
      this.grandparent.left : this.grandparent.right;
  }
  get siding() {
    if (!this.parent) {
      return undefined;
    }
    return this.isRightChild ? this.parent.left : this.parent.right;
  }
  get grandparent() {
    return this.parent ? this.parent.parent : undefined;
  }
  get isLeaf() {
    return this.children.every(child => child === undefined);
  }
  get hasOneChild() {
    if (this.right !== undefined) return this.left === undefined;
    return this.left !== undefined;
  }
  get hasTwoChildren() {
    return (this.right !== undefined && this.left !== undefined);
  }


  swapWithParent() {
    const replacement = new Binarytree(this.value);
    replacement.parent = this.parent;
    replacement.children = this.children;
    if (this.parent) (this.isRightChild) ?
      this.parent.right = replacement : this.parent.left = replacement;
    this.value = replacement.parent.value;
    this.children = replacement.parent.children;
    this.parent = replacement.parent.parent;

    for (const child of this.children) {
      if (child)
        child.parent = this;
    }
    for (const child of this.children) {
      for (const kid of child.children) {
        if (kid)
          kid.parent = child;
      }

    }
  }
  // this.children.forEach(child => { child.parent = this; });
  // this.children.forEach(child => {
  // child.children.forEach(kid => { kid.parent = child; });
  // });
  // }
  rotateRight() {
    this._rotate(RIGHT);
    this.swapWithParent();
  }
  rotateLeft() {
    this._rotate(LEFT);
    this.swapWithParent();
  }
  _rotate(dir) {
    const opposite = oppDir(dir);
    const pivot = this.children[opposite];
    this.children[opposite] = pivot.children[dir];
    pivot.children[dir] = this;
    pivot.parent = this.parent;
    pivot.children.forEach(child => { child.parent = pivot; });
    this.children.forEach(child => { child.parent = this; });
  }


  find(value) {
    const identifiedValue = value;
    const thisValue = this.value;
    if (thisValue === identifiedValue) {
      return this.value;
    }
    const dir = thisValue < identifiedValue ? RIGHT : LEFT;
    if (this.children[dir] === undefined) {
      return undefined;
    } else {
      return this.children[dir].find(value);
    }
  }
  contains(value) {
    return this.find(value) !== undefined;
  }

  insert(value) {
    if (this.value === undefined) {
      this.value = value;
      return this;
    }
    const dir = value >
     this.value ? RIGHT : LEFT;
    if (this.children[dir] === undefined) {
      const newTree = new Binarytree(value);
      newTree.parent = this;
      this.children[dir] = newTree;
      return newTree;
    } else {
      return this.children[dir].insert(value);
    }
  }

}

const BLACK = 'b';
const RED = 'r';

class RedBlackTree extends Binarytree {
  constructor(value, color = BLACK) {
    super(value);
    this.color = color;
  }

  swapWithParent() {
    const replacement =
      new RedBlackTree(this.value, this.color);
    replacement.parent = this.parent;
    replacement.children = this.children;
    if (this.parent) (this.isRightChild) ?
      this.parent.right = replacement : this.parent.left = replacement;
    this.value = replacement.parent.value;
    this.children = replacement.parent.children;
    this.parent = replacement.parent.parent;
    this.color = replacement.parent.color;

    this.children.forEach(child => { child.parent = this; });

    this.children.forEach(child => {
      child.children.forEach(kid => {  kid.parent = child; });
    });

  }
  paintBlack() {
    this.color = BLACK;
  }
  paintRed() {
    this.color = RED;
  }
  get isBlack() {
    return this.color === BLACK;
  }
  get isRed() {
    return this.color === RED;
  }

  paint() {
    return this._insert1;
  }
  _insert1() {
    if (this.parent === undefined) {
      this.paintBlack();
      return;
    } else {
      this._indert2();
    }
  }

  _insert2() {
    if (this.parent.isBlack) {
      return;
    } else {
      this._insert3();
    }
  }

  _insert3() {
    const uncle = this.uncle;
    if (uncle && uncle.isRed) {
      this.parent.paintBlack();
      uncle.paintBlack();
      this.grandparent.paintRed();
      this.grandparent.paint();
      return;
    } else {
      this._insert4();
    }
  }
  _insert4() {
    if (this.isRightChild && this.parent.isRightChild) {
      this.parent.rotateLeft();
      return;
    } else if (this.isLeftChild && this.parent.isLeft) {
      this.parent.rotatoRight();
      return;
    } else {
      this._insert5();
    }
  }
  _insert5() {
    this.parent.paintBlack();
    this.grandparent.paintRed();
    if (this.isLeftChild) {
      this.grandparent.rotaterRight();
    } else {
      this.grandparent.rotateLeft();
    }
    return;
  }

  insert(value) {
    if (this.value === undefined) {
      this.value = value;
      this.paintBlack;
      return;
    }
    const dir = value >
     this.value ? RIGHT : LEFT;
    if (this.children[dir] !== undefined) {
      return this.children[dir].insert(value);
    } else {
      const child = new RedBlackTree(value, RED);
      child.parent = this;
      this.children[dir] = child;
      child.paint();
      return child;
    }
  }
}


const rbt = new RedBlackTree();
rbt.insert(7);
rbt.insert(3);
rbt.insert(2);
rbt.insert(5);
console.log('Before\n');
console.dir(rbt, { depth: null, colors: true });
console.log('\n');
rbt.rotateRight();
console.log('After rotate\n');
console.dir(rbt, { depth: null, colors: true });
