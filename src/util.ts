// @ts-types="https://denopkg.com/gnlow/pipe@0.1.0/mod.ts"
export { pipe } from "https://esm.sh/gh/gnlow/pipe@0.1.0/mod.ts"

import xxhash from "https://esm.sh/xxhash-wasm@1.1.0"

// @ts-ignore: Error only on `deno check`?!
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

export const pick =
<T>
(selections: [number, T][]) =>
(target: number) => {
    if (selections.find(([p]) => p<0)) {
        throw new Error("Probability shouldn't be negative")
    }
    let sum = 0
    return selections.find(([p]) =>
        target < (sum += p)
    )![1]
}

export const normalize =
<T>
(selections: [number, T][]) => {
    if (selections.find(([p]) => p<0)) {
        throw new Error("Probability shouldn't be negative")
    }
    const sum = selections.reduce((a, [b]) => a + b, 0)
    return selections.map(([p, v]) => tuple(p/sum, v))
}

export const tuple =
// deno-lint-ignore no-explicit-any
<Args extends any[]>
(...args: Args) =>
    args
