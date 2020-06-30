enum Color {
  RED = "RED",
  BLACK = "BLACK"
}

class TreeNode<K, V> {
  key: K;
  value: V;
  left: TreeNode<K, V>;
  right: TreeNode<K, V>;
  color: Color;
  parent: TreeNode<K, V>;

  constructor(key: K, value: V, color: Color, parent: TreeNode<K, V>, left?: TreeNode<K, V>, right?: TreeNode<K, V>) {
    this.key = key;
    this.parent = parent;
    this.value = value;
    this.left = left;
    this.right = right;
    this.color = color;
  }

  inOrderKeys(): Array<K> {
    return this.doInOrder(this).map((node: TreeNode<K, V>) => node.key);
  }

  inOrderValues(): Array<V> {
    return this.doInOrder(this).map((node: TreeNode<K, V>) => node.value);
  }

  inOrder(): Array<TreeNode<K, V>> {
    return this.doInOrder(this);
  }

  private doInOrder(node: TreeNode<K, V>) {
    if (node == null) { return [] }
    else {
      return [...this.doInOrder(node.left), node, ...this.doInOrder(node.right)];
    }
  }
}

type Compare<K> = (a: K, b: K) => number;

export default class TreeMap<K, V> {
  private root: TreeNode<K, V>;
  private readonly compare: Compare<K>;
  private size: number;

  constructor(compare: Compare<K>) {
    this.compare = compare;
    this.size = 0;
  }

  put(key: K, value: V) {
    if (this.root == null) {
      this.root = new TreeNode(key, value, Color.BLACK, null);
      this.size = 1;
    } else {
      let current = this.root;
      let parent = null;
      let cmp = null;
      while (current != null) {
        parent = current;
        cmp = this.compare(key, current.key)
        if (cmp > 0) {
          current = current.right;
        } else if (cmp < 0) {
          current = current.left;
        } else {
          current.value = value;
          this.size++;
          return;
        }
      }
      let newNode = new TreeNode(key, value, Color.RED, parent)
      let uncle = null;
      if (cmp > 0) {
        parent.right = newNode;
        newNode.parent = parent;
        if (parent == this.root) {
          this.size++;
          return;
        }
        uncle = parent.parent.left;
      } else {
        parent.left = newNode;
        newNode.parent = parent;
        if (parent == this.root) {
          this.size++;
          return;
        }
        uncle = parent.parent.right;
      }
      if (parent.color == Color.RED) {
        if (uncle && uncle.color == Color.RED) {
          parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          this.fixColouring(newNode.parent.parent);
        }
        else {
          this.fixRotation(newNode, parent);
        }
      }
      while (this.root.parent != null) {
        this.root = this.root.parent;
      }
      this.size++;
    }
  }

  // remove entry by key
  remove(key: K) {
  }

  // iterate over map
  forEach() {
  }

  // get a new map with all keys grater than given key
  tailTreeMap() {

  }

  // get a new map with all keys lower than given key
  headTreeMap() {

  }

  getSize() {
    return this.size;
  }

  keys() {
    return this.root.inOrderKeys();
  }

  values() {
    return this.root.inOrderValues();
  }

  maxKey() {
    let curr = this.root;
    while (curr.right != null) { curr = curr.right };
    return curr.key;
  }

  minKey() {
    let curr = this.root;
    while (curr.left != null) { curr = curr.left };
    return curr.key;
  }

  floorKey(key: K) {
    let current = this.root;
    let floor = null;
    while (current != null) {
      let cmp = this.compare(key, current.key)
      if (cmp > 0) {
        floor = current.key;
        current = current.right;
      } else if (cmp < 0) {
        current = current.left;
      } else {
        return current.key;
      }
    }
    return floor;
  }

  ceilingKey(key: K) {
    let current = this.root;
    let ceil = null;
    while (current != null) {
      let cmp = this.compare(key, current.key)
      if (cmp > 0) {
        current = current.right;
      } else if (cmp < 0) {
        ceil = current.key;
        current = current.left;
      } else {
        return current.key;
      }
    }
    return ceil;

  }
  toString() {
    console.dir(this.root.left.right);
  }

  toArray(): Array<TreeNode<K, V>> {
    return this.root.inOrder();
  }

  private swapColor(x: TreeNode<K, V>, y: TreeNode<K, V>) {
    let tmp = x.color;
    x.color = y.color;
    y.color = tmp;
  }

  private fixColouring(node: TreeNode<K, V>) {
    if (node == null || node.parent == null) { return; }
    else {
      node.color = Color.RED;
      this.fixColouring(node.parent.parent);
    }
  }

  private leftLeft(p: TreeNode<K, V>, g: TreeNode<K, V>) {
    // right rotate p
    let tmp = g.parent;
    p.right = g;
    g.parent = p;
    p.parent = tmp;
    tmp.left = p;
    g.left = null;
    // swap colors of g and p
    this.swapColor(p, g)
  }

  private rightRight(p: TreeNode<K, V>, g: TreeNode<K, V>) {
    // left rotate p
    let tmp = g.parent;
    p.left = g;
    g.parent = p;
    p.parent = tmp;
    tmp.right = p;
    g.right = null;
    // swap colors of g and p
    this.swapColor(p, g)
  }

  private fixRotation(x: TreeNode<K, V>, p: TreeNode<K, V>) {
    let g = p.parent;
    // Left left p is left child of g and x is left child of p
    if (p == g.left && x == p.left) {
      this.leftLeft(p, g);
    }
    // Left Right Case (p is left child of g and x is right child of p)
    if (p == g.left && x == p.right) {
      // left rotate p
      g.left = x;
      x.left = p;
      x.parent = g;
      p.parent = x;
      this.leftLeft(x, g)
    }

    // Right Right Case(Mirror of case Left Left)
    if (p == g.right && x == p.right) {
      this.rightRight(p, g);
    }

    // Right Left Case (Mirror of case Left Right)
    if (p == g.right && x == p.left) {
      // right rotate p
      g.right = x;
      x.parent = g;
      x.right = p;
      p.parent = x;
      this.rightRight(x, g);
    }
  }
}
