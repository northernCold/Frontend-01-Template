class MinBinaryHeap {
  constructor (data, compare) {
    this.data = data;
    this.compare = compare;
  }

  take () {
    const leftChild = (data, parentId) => data[parentId * 2 + 1];
    const rightChild = (data, parentId) => data[parentId * 2 + 2];
    const { data, compare } = this;
    const lastNoLeaf = Math.floor(data.length / 2) -1;
    for (let i = lastNoLeaf; i >= 0; i--) {
      let index = i;
      if (rightChild(data, i) && compare(rightChild(data, i), data[index]) < 0) {
        index = i * 2 + 2;
      }
      if (leftChild(data, i) && compare(leftChild(data, i), data[index]) < 0) {
        index = i * 2 + 1;
      }

      if (compare(data[index], data[i]) < 0) {
        this.swap(i, index)
      }
    }

    const result = data[0];
    data.shift();
    return result;
  }

  swap (i, j) {
    const { data } = this;
    let t;
    t = data[i];
    data[i] = data[j];
    data[j] = t;
  }

  insert(v) {
    this.data.push(v);
  }

  toString() {
    return this.data
  }

  get length () {
    return this.data.length;
  }
}

const tree = new MinBinaryHeap([424, 442, 388, 370], (a, b) => a- b);
console.log(
  Array.from({ length: tree.length }).map(_ => tree.take())
)