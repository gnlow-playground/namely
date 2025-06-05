import { hash, normalize, pick, pipe } from "./util.ts"
import { icdf } from "./util/icdf.ts"

class Lang2 {
    seed
    constructor(seed: number) {
        this.seed = seed
    }
    
    __rand_i = 0
    rand() {
        return hash(
            this.seed + "__" + this.__rand_i++
        )
    }

    getStructures() {
        const onset = pick([
            [0.2, ["(c)"]],
            [0.3, ["(c)", "cg"]],
            [0.2, ["(c)", "cc"]],
            [0.2, ["(c)", "cc", "ccg"]],
            [0.1, ["(c)", "cc", "ccc"]],
        ])(this.rand())
        const nucleus = pick([
            [0.3, ["v"]],
            [0.4, ["v", "vv"]],
            [0.3, ["v", "vv", "vvv"]],
        ])(this.rand())
        const coda = pick([
            [0.6, ["", "c"]],
            [0.3, ["", "c", "cc"]],
            [0.1, ["", "c", "cc", "ccc"]],
        ])(this.rand())

        const setFreq =
        (as: string[]) => as.map((a, i) => [
            icdf(6-i, 2)(this.rand()),
            a,
        ] as [number, string])

        return [onset, nucleus, coda].map(x => pipe(
            x,
            setFreq,
            x => x.filter(([p]) => p>0),
            normalize,
        ))
    }
    pickStructure() {
        this.getStructures()
    }
}

const lang = new Lang2(0.127)
console.log(
    lang.getStructures()
)
