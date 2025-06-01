import { Mat } from "./src/Mat.ts"
import {
arr,
    hash,
    pipe,
 } from "./src/util.ts"

const phonemesData = `
    a,e,i,u,o
    j,w
    l,r
    m,n
    s,z,f,v
    p,t,k,b,d,g
`
    .trim()
    .split("\n")
    .map(x => x.trim().split(","))
console.log(phonemesData)

const phonemes = [
    "",
    ...phonemesData.flat(),
]

const mat = pipe(
    new Mat([
        phonemes.length,
        phonemes.length,
    ]),
    x => x.map(hash),
    mat => {
        const sums = arr(mat.dimension[0])
            .map(x => mat.gets([x, null])
                .reduce((a, b) => a+b)
            )
        return mat.map((v, [_, x]) => v/sums[x]) // todo: fix this
    },
    mat => arr(mat.dimension[0])
    .map(x => mat.gets([x, null])
        .reduce((a, b) => a+b)
    )
)

console.log(
    mat
)
