// @ts-types="https://denopkg.com/gnlow/pipe@0.1.0/mod.ts"
export { pipe } from "https://esm.sh/gh/gnlow/pipe@0.1.0/mod.ts"

import xxhash from "https://esm.sh/xxhash-wasm@1.1.0"

const { h32 } = await xxhash()

export const hash =
(n: string | number) =>
    h32(n+"") / 2**32

export const n2ns =
(ls: number[]) =>
(n: number) =>
    ls.reduce(
        (a, b) => {
            const res = [...a, n % b]
            n = Math.floor(n / b)
            return res
        },
        [] as number[],
    )

export const ns2n =
(ls: number[]) =>
(ns: number[]) =>
    ns.reduceRight(
        (a, b, i) => a * ls[i] + b,
        0,
    )

export const arr =
(length: number) =>
    Array.from({ length }, (_, i) => i)

export class Mat {
    dimension
    data
    constructor(dimension: number[], data: number[]) {
        this.dimension = dimension
        this.data = data
    }

    ns2n(ns: number[]) { return ns2n(this.dimension)(ns) }
    n2ns(n: number) { return n2ns(this.dimension)(n) }

    get(is: number[]) {
        return this.data[this.ns2n(is)]
    }
    set(is: number[], value: number) {
        this.data[this.ns2n(is)] = value
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
}
