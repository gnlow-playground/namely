import {
    arr,
    ns2n,
    n2ns,
} from "./util.ts"

export const _ = null

export class Mat<T> {
    dimension
    data
    constructor(dimension: number[], data: T[]) {
        this.dimension = dimension
        this.data = data
    }

    static fromDimension<T>(dimension: number[]) {
        return new Mat<number>(
            dimension,
            arr(dimension.reduce((a, b) => a*b, 1)),
        )
    }

    ns2n(ns: number[]) { return ns2n(this.dimension)(ns) }
    n2ns(n: number) { return n2ns(this.dimension)(n) }

    get(is: number[]) {
        return this.data[this.ns2n(is)]
    }
    set(is: number[], value: T) {
        this.data[this.ns2n(is)] = value
    }

    gets(ns: (number | null)[]) {
        let i = 0
        const mapper = ns.map(n => n == null ? i++ : -1)
        const dimension = ns
            .map((ns, i) => ns == null ? this.dimension[i] : 0)
            .filter(x => !!x)
        return Mat.fromDimension(dimension)
            .map((_, newNs) => this.get(ns.map((n, i) =>
                n == null
                    ? newNs[mapper[i]!]
                    : n
            )))
    }

    indexes(ns: (number | null)[]) {
        return this.gets(ns).map((_, is) => is)
    }

    map<O>(f: (value: T, is: number[]) => O) {
        return new Mat(
            this.dimension,
            this.data.map((v, i) => f(v, this.n2ns(i))),
        )
    }
    forEach(f: (value: T, is: number[]) => void) {
        this.map(f)
    }
    reduce(
        f: (prev: T, value: T, is: number[]) => T,
    ): T
    reduce<O>(
        f: (prev: O, value: T, is: number[]) => O,
        init: O,
    ): O
    reduce<O>(
        f: (prev: O, value: T, is: number[]) => O,
        init?: O,
    ): T | O {
        if (init) {
            return this.data.reduce(
                (prev, value, i) =>
                    f(prev, value as T, this.n2ns(i)),
                init as O,
            )
        } else {
            return this.data.reduce(
                (prev, value, i) =>
                    (f as unknown as (prev: T, value: T, is: number[]) => T)(prev as T, value as T, this.n2ns(i)),
            )
        }
    }

    groupBy<K>(f: (value: T, is: number[]) => K) {
        return Map.groupBy(this.data, (v, i) => f(v, this.n2ns(i)))
    }
    groupByAxis(axis: number) {
        const map = this.groupBy((_, is) => is[axis])
        const data = arr(this.dimension[axis])
            .map(i => map.get(i)!)
        return new Mat([data.length], data)
    }

    sum() {
        return (this as Mat<number>).reduce((a, b) => a+b)
    }

    toArray() {
        return this.data
    }
}
