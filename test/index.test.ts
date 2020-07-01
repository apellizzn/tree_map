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
      tree.put(0, 0);
      tree.put(1, 1);
      tree.put(2, 2);
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

  describe('remove', () => {
    it('works for an empty tree map', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.remove(1);
      expect(tree.getSize()).toBe(0);
    })

    it('works for a tree of height 1', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      tree.remove(2)
      expect(tree.getSize()).toBe(1);
    })

    it('self balance', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      tree.put(0, 0);
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(6, 6);
      tree.remove(4)
      expect(tree.getSize()).toBe(5);
      expect(tree.keys()).toEqual([0, 1, 2, 5, 6])
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

  describe('max', () => {
    it("keep tracks of max", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      expect(tree.max().key).toBe(1)
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.max().key).toBe(2)
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(6, 6);
      expect(tree.max().key).toBe(6)
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

  describe('min', () => {
    it("keep tracks of min key", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      expect(tree.min().key).toBe(1)
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.min().key).toBe(0)
      tree.put(4, 4);
      tree.put(5, 5);
      tree.put(-6, -6);
      expect(tree.min().key).toBe(-6)
    })
  })

  describe('map', () => {
    it('map over nodes', () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(1, 1);
      tree.put(2, 2);
      tree.put(0, 0);
      expect(tree.map((x) => `${x.value + 1}`).values()).toEqual(["1", "2", "3"]);
    })
  })

  describe('headTreeMap', () => {
    it("returns a new tree map with all lower keys", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(2, 2);
      tree.put(1, 1);
      tree.put(3, 3);
      tree.put(0, 0);
      tree.put(4, 4);
      let newTree = tree.headTreeMap(2);
      expect(newTree.getSize()).toBe(3)
      expect(newTree.keys()).toEqual([0, 1, 2])
    })
  })

  describe('tailTreeMap', () => {
    it("returns a new tree map with all higher keys", () => {
      tree = new TreeMap<Number, Number>(cmp);
      tree.put(2, 2);
      tree.put(1, 1);
      tree.put(3, 3);
      tree.put(0, 0);
      tree.put(4, 4);
      let newTree = tree.tailTreeMap(2);
      expect(newTree.getSize()).toBe(3)
      expect(newTree.keys()).toEqual([2, 3, 4])
    })
  })
})
