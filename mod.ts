import { Mat, _ } from "./src/Mat.ts"
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

class Lang {
    seed
    table
    constructor(seed: number | string) {
        this.seed = seed
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
    hash(...seeds: (number | string)[]) {
        return hash(this.seed+"_"+seeds.join("_"))
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
    generate(length: number, seed: number) {
        const result = [0] as number[]
        arr(length).forEach(i => {
            result.push(this.pick([result[i-1]], this.hash(seed, i))[1])
        })
        return result.map(x => phonemes[x]).join("")
    }
}

const lang = new Lang(0.6)
console.log(arr(10).map(i => lang.generate(5, i)).join("\n"))
