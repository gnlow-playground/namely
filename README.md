# namely
name generator

## memo
- 행렬 라이브러리 내가 만들어야 하나..?ㅜ
    - Polars.js: 브라우저 지원 안함
    - Danfo.js: `Uncaught (in promise) TypeError: this.util.TextEncoder is not a constructor`

### 음절 구조
- https://wals.info/chapter/12
- 유럽엔 복잡한 음절 구조가 많고 아시아는 거의 Moderately Complex네

||n|
|-|-|
|<=CV|61|
|<=CGVC|274|
|>CGVC|151|

- onset
    - ∅
    - c
    - c, cg
    - c, cc
    - c, cc, ccg
    - c, cc, ccc
- nucleus
    - v
    - vv
    - vvv
- coda
    - ∅
    - c
    - c, cc
    - c, cc, ccc

## Ref
- Sonority Sequencing Priciple
- https://github.com/gnlow-playground/Langen
- https://wals.info/
- https://phoible.org/
