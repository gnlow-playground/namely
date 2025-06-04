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
    b,d,g,p,t,k
`
    .trim()
    .split("\n")
    .map(x => x.trim().split(","))
    .reverse()
console.log(phonemesData)

const phonemes = [
    "_",
    ...phonemesData.flat(),
]

const getSonority =
(phoneme: string) =>
    phonemesData.findIndex(v => v.includes(phoneme))

const vowelSonority = phonemesData.length-1

const ssp =
(sonorities: number[]) => {
    let dir = 1
    let prev = -2
    let sylEnd = false
    for (const curr of sonorities) {
        sylEnd = false
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
                sylEnd = true
            }
        }
        prev = curr
    }
    return sylEnd ? "sylEnd" : true
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
        let out = ""
        arr(length).forEach(i => {
            do {
                result.push(
                    this.pickUntil(
                        [result[result.length-1]],
                        this.hash(seed, i),
                        id => !!ssp([
                            ...result.map(x => getSonority(phonemes[x])), getSonority(id),
                        ]),
                    )
                )
                out += phonemes[result[result.length-1]]
            } while (
                ssp(result.map(x => getSonority(phonemes[x])))
                != "sylEnd"
            )
            out = out.slice(0, -1) + "-" + out.slice(-1)
        })
        return out
    }
}

const lang = new Lang(0.6)
console.log(arr(10).map(i => lang.generate(2, i)).join("\n"))
