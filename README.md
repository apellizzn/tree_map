## TreeMap
TreeMap implementation in Typescript using
[Red/Black Binary Search Tree data structure](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)

Self balancing tree grants search in __O(log n)__ where __n__ is the number of nodes in the tree

### Main Usage

  - add an item
```typescript
let compareFun = (x, y) => {
  if(x > y) { return 1; }
  else if(y > x) { return -1};
  else return 0;
}
let superHeroes = new TreeMap<Number, String>(compareFun);
superHeroes.put(2, "Iron man");
superHeroes.put(1, "Batman");
superHeroes.put(3, "Hulk");
superHeroes.put(4, "Robin");

superHeroes.values() // ["Batman", "Iron man", "Hulk", "Robin"]
```
  - get ordered subset

```typescript
let beforeThirdPosition = superHeroes.headTreeMap(3).values() // ["Batman", "Iron man", "Hulk"]
let afterThirdPosition = superHeroes.tailTreeMap(3).values() // ["Hulk", "Robin"]
```
  - search

```typescript
superHeroes.search(3) // { value: "Hulk", key: 3}
```

  - get min and max
```typescript
let topSuperHero = superHeroes.min() // {value: "Batman", key: 1}
let worstSuperHero = superHeroes.max() // {value: "Robin", key: 4}
```

  - map over tree
```typescript
superHeroes.put(5, "Superman");

let wearCapes = superHeroes.map((hero) =>
  hero.value.startsWith("S") ?
    hero.value + " with Cape!"
    : hero.value;
)

wearCapes.values() // ["Batman", "Iron man", "Hulk", "Robin", "Superman with Cape!"]
```


