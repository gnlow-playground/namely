import { arr, hash, normalize, pick, pipe, tuple, uniform, until } from "./util.ts"
import { icdf } from "./util/icdf.ts"
import { getSonority, ssp } from "./util/ssp.ts";

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
        return this.structure
            .map(x => pick(x)(this.rand()))
            .join("")
    }
    pickSyllable(structure: string) {
        return structure
            .replace("(c)", pick([
                [0.5, "c"],
                [0.5, ""],
            ])(lang.rand()))
            .replaceAll(/[cgv]/g, s =>
                pipe(
                    phonemes[s as "c" | "g" | "v"].split(""),
                    uniform,
                    pick,
                )(lang.rand())
            )
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

const phonemes = {
    c: "lrmnvzfsbdgptk",
    g: "jw",
    v: "aeiuo",
}

const lang = new Lang2(0.333)
console.log(
    arr(15).map(() => until
        ((x: string) => pipe(
            x,
            x => x.split(""),
            x => x.map(getSonority),
            x => ssp(x) == true,
        ))
        (() => 
            pipe(
                lang.pickStructure(),
                lang.pickSyllable,
            )
        )
    )
)
