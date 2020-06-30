import TreeMap from "..";

describe('TreeMap', () => {
  let cmp = (x, y) => {
    if (x > y) return 1;
    else if (x < y) return -1
    else return 0;
  }

  let tree = null;

  describe('put', () => {
    it('works for an empty tree map', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      expect(tree.getSize()).toBe(1);
    })

    it('works for a tree of height 1', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      expect(tree.getSize()).toBe(2);
    })

    it('inserts data in order', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.getSize()).toBe(3);
      expect(tree.keys()).toEqual([0, 1, 2])
    })

    it('self balance right right', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      tree.put(0, 0);
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(6, 6);
      expect(tree.getSize()).toBe(6);
      expect(tree.keys()).toEqual([0, 1, 2, 4, 5, 6])
    })

    it('self balance left left', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      tree.put(0, 0);
      tree.put(-4, -4);
      tree.put(-5, -5);
      tree.put(-6, -6);
      expect(tree.getSize()).toBe(6);
      expect(tree.keys()).toEqual([-6, -5, -4, 0, 1, 2])
    })
  })

  describe("keys", () => {
    it("returns in order keys", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      expect(tree.keys()).toEqual([1])
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.keys()).toEqual([0, 1, 2])
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(6, 6);
      expect(tree.keys()).toEqual([0, 1, 2, 4, 5, 6])
    })
  })

  describe("values", () => {
    it("returns values using keys order", () => {
      tree = new TreeMap<Number, String>(cmp);
      tree.put(1, "one");
      expect(tree.values()).toEqual(["one"])
      tree.put(2, "two");
      tree.put(0, "zero");
      expect(tree.values()).toEqual(["zero", "one", "two"])
      tree.put(4, "four");
      tree.put(5, "five");
      tree.put(6, "six");
      expect(tree.values()).toEqual(["zero", "one", "two", "four", "five", "six"])
    })
  })

  describe('maxKey', () => {
    it("keep tracks of max key", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      expect(tree.maxKey()).toBe(1)
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.maxKey()).toBe(2)
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(6, 6);
      expect(tree.maxKey()).toBe(6)
    })
  })

  describe('floorKey', () => {
    describe('when the key is present', () => {
      it('returns the key itself', () => {
        tree = new TreeMap<Number, Number>(cmp);
        tree.put(1, 1);
        tree.put(2, 2);
        tree.put(0, 0);
        tree.put(4, 4);
        expect(tree.floorKey(2)).toBe(2)
      })
    })

    describe('when all the keys are grater', () => {
      it('returns null', () => {
        tree = new TreeMap<Number, Number>(cmp);
        tree.put(1, 1);
        tree.put(2, 2);
        tree.put(0, 0);
        tree.put(4, 4);
        expect(tree.floorKey(-2)).toBeNull();
      })
    })
  })

  describe('ceilingKey', () => {
    describe('when the key is present', () => {
      it('returns the key itself', () => {
        tree = new TreeMap<Number, Number>(cmp);
        tree.put(1, 1);
        tree.put(2, 2);
        tree.put(0, 0);
        tree.put(4, 4);
        expect(tree.ceilingKey(2)).toBe(2)
      })
    })

    describe('when all the keys are lower', () => {
      it('returns null', () => {
        tree = new TreeMap<Number, Number>(cmp);
        tree.put(1, 1);
        tree.put(2, 2);
        tree.put(0, 0);
        tree.put(4, 4);
        expect(tree.ceilingKey(5)).toBeNull();
      })
    })

    describe('when there is at least 1 grater key', () => {
      it('returns that key', () => {
        tree = new TreeMap<Number, Number>(cmp);
        tree.put(1, 1);
        tree.put(2, 2);
        tree.put(0, 0);
        tree.put(4, 4);
        expect(tree.ceilingKey(3)).toBe(4);
      })
    })
  })

  describe('minKey', () => {

    it("keep tracks of min key", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      expect(tree.minKey()).toBe(1)
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.minKey()).toBe(0)
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(-6, -6);
      expect(tree.minKey()).toBe(-6)
    })
  })
})
