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
    v,z
    f,s
    b,d,g
    p,t,k
`
    .trim()
    .split("\n")
    .map(x => x.trim().split(","))
    .reverse()
console.log(phonemesData)

const phonemes = [
    "",
    ...phonemesData.flat(),
]

const getSonority =
(phoneme: string) =>
    phonemesData.findIndex(v => v.includes(phoneme))

const vowelSonority = phonemesData.length-1

const ssp =
(sonorities: number[]) => {
    console.log(sonorities)
    let dir = 1
    let prev = -2
    for (const curr of sonorities) {
        if (prev == curr) return false
        if (dir == 1) {
            if (prev > curr) {
                if (prev == vowelSonority) {
                    dir = -1
                } else {
                    return false
                }
            }
        }
        if (dir == -1) {
            if (prev < curr) {
                dir = 1
            }
        }
        prev = curr
    }
    return true
}

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
    pickUntil(
        prevState: [number],
        seed: number,
        f: (phoneme: string) => boolean,
    ) {
        let phonemeId
        let i = 0
        do {
            phonemeId = this.pick(prevState, this.hash(seed, i++))[1]
        } while (!f(phonemes[phonemeId]))
        return phonemeId
    }
    generate(length: number, seed: number) {
        const result = [0]
        arr(length).forEach(i => {
            result.push(
                this.pickUntil(
                    [result[i-1]],
                    this.hash(seed, i),
                    id => ssp([
                        ...result.map(x => getSonority(phonemes[x])), getSonority(id),
                    ]),
                )
            )
        })
        return result.map(x => phonemes[x]).join("")
    }
}

const lang = new Lang(0.9)
console.log(arr(10).map(i => lang.generate(10, i)).join("\n"))
