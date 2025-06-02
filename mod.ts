import { Mat, _ } from "./src/Mat.ts"
import {
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
    Mat.fromDimension([
        phonemes.length,
        phonemes.length,
    ]),
    x => x.map(hash),
    mat => {
        const sums = mat
            .sumByAxis(0)
            .toArray()
        return mat.map((v, [x]) => v/sums[x])
    },
    mat => mat
        .sumByAxis(0),
)

console.log(
    mat
)
