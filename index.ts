import { TreeNode } from "./test/TreeNode";
import { Color } from "./color";

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

  search(key: K): TreeNode<K, V> {
    return this.doSearch(this.root, key);
  }

  // remove entry by key
  remove(key: K) {
    let node = this.search(key);
    if (node == null) { return; }
    this.doRemove(node);
  }

  private doRemove(node: TreeNode<K, V>) {
    let replace = this.replace(node);
    let parent = node.parent;
    let bothBlack = node.color == Color.BLACK && (replace == null || replace.color == Color.BLACK);

    if (replace == null) {
      // v is leaf
      if (node == this.root) {
        // node is root, making root null

        this.root = null;
        this.size--;
      } else {
        if (bothBlack) {
          // node and replace both black
          // node is leaf, fix double black at node
          this.fixDoubleBlack(node);
        }
        else {
          // node or replace are red
          if (node.sibling() != null)
            // sibling is not null, make it red"
            node.sibling().color = Color.RED;
        }

        // delete node from the tree
        if (node == parent.left) {
          parent.left = null;
        } else {
          parent.right = null;
        }
        this.size--;
      }
      return;
    }

    if (node.left == null || node.right == null) {
      // v has 1 child
      if (node == this.root) {
        // node is root, assign the value of u to v, and delete u
        node.value = replace.value;
        node.key = replace.key;
        node.left = null;
        replace.right = null;
      } else {
        // Detach node from tree and move u up
        if (node == node.parent.left) {
          parent.left = replace;
        } else {
          parent.right = replace;
        }
        replace.parent = parent;

        if (bothBlack) {
          // u and node both black, fix double black at u
          this.fixDoubleBlack(replace);
        } else {
          // u or node red, color u black
          replace.color = Color.BLACK;
        }
      }
      this.size--;
      return;
    }

    let tmpKey = node.key;
    let tmpValue = node.value;
    node.key = replace.key;
    node.value = replace.value;
    replace.key = tmpKey;
    replace.value = tmpValue;
    this.doRemove(replace);
  }

  forEach(f: (f: TreeNode<K, V>) => void) {
    this.toArray().forEach(f);
  }

  map<T>(f: (node: TreeNode<K, V>) => T): TreeMap<K, T> {
    return this.toArray().reduce(
      (result, current) => {
        let newValue = f(current);
        result.put(current.key, newValue);
        return result;
      }, new TreeMap<K, T>(this.compare)
    );
  }

  // get a new map with all keys grater than given key
  tailTreeMap(key: K): TreeMap<K, V> {
    return this.toArray().reduce(
      (result, current) => {
        if (this.compare(current.key, key) >= 0) {
          result.put(current.key, current.value);
        }
        return result;
      }, new TreeMap<K, V>(this.compare)
    );
  }

  // get a new map with all keys lower than given key
  headTreeMap(key: K): TreeMap<K, V> {
    return this.toArray().reduce(
      (result, current) => {
        if (this.compare(current.key, key) <= 0) {
          result.put(current.key, current.value);
        }
        return result;
      }, new TreeMap<K, V>(this.compare)
    );
  }

  getSize() {
    return this.size;
  }

  keys(): Array<K> {
    return this.root.inOrderKeys();
  }

  values(): Array<V> {
    return this.root.inOrderValues();
  }

  max(): TreeNode<K, V> {
    let curr = this.root;
    while (curr.right != null) { curr = curr.right };
    return curr;
  }

  min(): TreeNode<K, V> {
    let curr = this.root;
    while (curr.left != null) { curr = curr.left };
    return curr;
  }

  floorKey(key: K): K {
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

  ceilingKey(key: K): K {
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

  toArray(): Array<TreeNode<K, V>> {
    return this.root.inOrder();
  }

  private replace(node: TreeNode<K, V>) {
    // when node have 2 children
    if (node.left != null && node.right != null)
      return this.successor(node.right);

    // when leaf
    if (node.left == null && node.right == null)
      return null;

    // when single child
    return node.left != null ? node.left : node.right;
  }

  private successor(node: TreeNode<K, V>) {
    while (node.left != null) {
      node = node.left;
    }
    return node;
  }

  private doSearch(node: TreeNode<K, V>, key: K) {
    if (node == null) { return null }
    let cmp = this.compare(key, node.key);
    if (cmp == 0) { return node; }
    else {
      return cmp > 0 ?
        this.doSearch(node.right, key)
        : this.doSearch(node.left, key);
    }
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
    if (tmp) { tmp.left = p; }
    g.left = null;
    // swap colors of g and p
    this.swapColor(p, g)
  }

  private rightRight(p: TreeNode<K, V>, g: TreeNode<K, V>) {
    let tmp = g.parent;
    p.left = g;
    g.parent = p;
    p.parent = tmp;
    if (tmp) { tmp.right = p; }
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

  private fixDoubleBlack(x: TreeNode<K, V>) {
    if (x == this.root) return;
    let sibling = x.sibling()
    let parent = x.parent;
    if (sibling == null) {
      // No sibling, double black pushed up
      this.fixDoubleBlack(parent);
    } else {
      if (sibling.color == Color.RED) {
        // Sibling red
        parent.color = Color.RED;
        sibling.color = Color.BLACK;
        if (sibling == parent.left) {
          // left case
          this.rightRotate(parent);
        } else {
          // right case
          this.leftRotate(parent);
        }
        this.fixDoubleBlack(x);
      } else {
        // Sibling black
        if (
          (sibling.left && sibling.left.color == Color.RED)
          || (sibling.right && sibling.right.color == Color.BLACK)) {
          // at least 1 red children
          if (sibling.left && sibling.left.color == Color.RED) {
            if (sibling == parent.left) {
              // left left
              sibling.left.color = sibling.color;
              sibling.color = parent.color;
              this.rightRotate(parent);
            } else {
              // right left
              sibling.left.color = parent.color;
              this.rightRotate(sibling);
              this.leftRotate(parent);
            }
          } else {
            if (sibling == parent.left) {
              // left right
              sibling.right.color = parent.color;
              this.leftRotate(sibling);
              this.rightRotate(parent);
            } else {
              // right right
              sibling.right.color = sibling.color;
              sibling.color = parent.color;
              this.leftRotate(parent);
            }
          }
          parent.color = Color.BLACK;
        } else {
          // 2 black children
          sibling.color = Color.RED;
          if (parent.color == Color.BLACK)
            this.fixDoubleBlack(parent);
          else
            parent.color = Color.BLACK;
        }
      }
    }
  }

  private rightRotate(x: TreeNode<K, V>) {
    // new parent will be node's left child
    let parent = x.left;

    // update root if current node is root
    if (x == this.root)
      this.root = parent;

    x.moveDown(parent);

    // connect x with new parent's right element
    x.left = parent.right;
    // connect new parent's right element with node
    // if it is not null
    if (parent.right != null)
      parent.right.parent = x;

    // connect new parent with x
    parent.right = x;
  }

  private leftRotate(x: TreeNode<K, V>) {
    // new parent will be node's right child
    let parent = x.right;

    // update root if current node is root
    if (x == this.root)
      this.root = parent;

    x.moveDown(parent);

    // connect x with new parent's left element
    x.right = parent.left;
    // connect new parent's left element with node
    // if it is not null
    if (!parent.left)
      parent.left.parent = x;

    // connect new parent with x
    parent.left = x;
  }
}
