## TreeMap
TreeMap implementation in Typescript using Red/Black Binary Search Trees data structure
[Red/Black Binary Search Trees data structure](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)

Self balancing tree grants search in *O(log n)*

### Usage
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
let beforeThirdPosition = superHeroes.headTreeMap(3).values() // ["Batman", "Iron man", "Hulk"]
let afterThirdPosition = superHeroes.headTreeMap(3).values() // ["Hulk", "Robin"]

superHeroes.search(3) // { value: "Hulk", key: 3}

let topSuperHero = superHeroes.max() // {value: "Batman", key: 1}
let worstSuperHero = superHeroes.max() // {value: "Robin", key: 4}

superHeroes.put(5, "Superman");

let wearCapes = superHeroes.map((hero) =>
  hero.value.startsWith("S") ?
    hero.value + " with Cape!"
    : hero.value;
)


```
