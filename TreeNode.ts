import { Color } from "./Color";

export class TreeNode<K, V> {
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

  sibling() {
    if (this.parent == null) { return null; }
    else {
      if (this == this.parent.left) return this.parent.right;
      return this.parent.left;
    }
  }

  moveDown(parent: TreeNode<K, V>) {
    if (this.parent != null) {
      if (this == this.parent.left) {
        this.parent.left = parent;
      } else {
        this.parent.right = parent;
      }
    }
    parent.parent = this.parent;
    this.parent = parent;
  }

  private doInOrder(node: TreeNode<K, V>) {
    if (node == null) { return [] }
    else {
      return [...this.doInOrder(node.left), node, ...this.doInOrder(node.right)];
    }
  }
}
