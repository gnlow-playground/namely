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

class Lang {
    table
    constructor(seed: number | string) {
        this.table = pipe(
            Mat.fromDimension([
                phonemes.length,
                phonemes.length,
            ]),
            x => x.map(x => hash(seed+"_"+x)),
            mat => {
                const sums = mat
                    .sumByAxis(0)
                    .toArray()
                return mat.map((v, [x]) => v/sums[x])
            },      
        )
    }
    pick(prevState: [number], seed: number) {
        return pipe(
            this.table,
            mat => mat
                .gets([...prevState, _])
                .toArray(),
            arr => {
                let pSum = 0
                return [0, arr.findIndex(p =>
                    seed <= (pSum += p)
                )]
            },
        )
    }
}

const lang = new Lang(0.5)

console.log(
    lang.pick([0], 0.8)
)
