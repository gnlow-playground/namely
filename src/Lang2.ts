import { arr, hash, normalize, pick, pipe, tuple } from "./util.ts"
import { icdf } from "./util/icdf.ts"

class Lang2 {
    seed
    structure
    constructor(seed: number) {
        this.seed = seed
        this.structure = Lang2.getStructures(() => this.rand())
    }
    
    __rand_i = 0
    rand() {
        return hash(
            this.seed + "__" + this.__rand_i++
        )
    }
    pickStructure() {
        return this.structure.map(x => pick(x)(this.rand()))
    }

    static getStructures(rand: () => number) {
        const onset = pick([
            [0.2, ["(c)"]],
            [0.3, ["(c)", "cg"]],
            [0.2, ["(c)", "cc"]],
            [0.2, ["(c)", "cc", "ccg"]],
            [0.1, ["(c)", "cc", "ccc"]],
        ])(rand())
        const nucleus = pick([
            [0.3, ["v"]],
            [0.4, ["v", "vv"]],
            [0.3, ["v", "vv", "vvv"]],
        ])(rand())
        const coda = pick([
            [0.6, ["", "c"]],
            [0.3, ["", "c", "cc"]],
            [0.1, ["", "c", "cc", "ccc"]],
        ])(rand())

        const setFreq =
        (as: string[]) => as.map((a, i) => tuple(
            icdf(6-i, 2)(rand()),
            a,
        ))

        return [onset, nucleus, coda].map(x => pipe(
            x,
            setFreq,
            x => x.filter(([p]) => p>0),
            normalize,
        ))
    }
}

const lang = new Lang2(0.128)
console.log(
    arr(10).map(() => 
        lang.pickStructure().join("")
    )
)
