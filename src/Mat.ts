import {
    arr,
    ns2n,
    n2ns,
} from "./util.ts"

export class Mat {
    dimension
    data
    constructor(dimension: number[], data?: number[]) {
        this.dimension = dimension
        this.data = data || arr(dimension.reduce((a, b) => a*b, 1))
    }

    ns2n(ns: number[]) { return ns2n(this.dimension)(ns) }
    n2ns(n: number) { return n2ns(this.dimension)(n) }

    get(is: number[]) {
        return this.data[this.ns2n(is)]
    }
    set(is: number[], value: number) {
        this.data[this.ns2n(is)] = value
    }

    gets(ns: (number | null)[]) {
        let i = 0
        const mapper = ns.map(n => n == null ? i++ : -1)
        const dimension = ns
            .map((ns, i) => ns == null ? this.dimension[i] : 0)
            .filter(x => !!x)
        return new Mat(dimension)
            .map((_, newNs) => this.get(ns.map((n, i) =>
                n == null
                    ? newNs[mapper[i]!]
                    : n
            )))
    }

    map(f: (value: number, is: number[]) => number) {
        return new Mat(
            this.dimension,
            this.data.map((v, i) => f(v, this.n2ns(i)))
        )
    }
    forEach(f: (value: number, is: number[]) => number) {
        this.map(f)
    }
    reduce(
        f: (prev: number, value: number, is: number[]) => number,
    ): number
    reduce<T>(
        f: (prev: T, value: number, is: number[]) => T,
        init: T,
    ): T
    reduce<T>(
        f: (prev: T, value: number, is: number[]) => T,
        init?: T,
    ): T | number {
        if (init) {
            return this.data.reduce(
                (prev, value, i) =>
                    f(prev, value, this.n2ns(i)),
                init as T,
            )
        } else {
            return this.data.reduce(
                (prev, value, i) =>
                    (f as unknown as (prev: number, value: number, is: number[]) => number)(prev, value, this.n2ns(i)),
            )
        }
    }

    sum() {
        return this.reduce((a, b) => a+b)
    }
}
