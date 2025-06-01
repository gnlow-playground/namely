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
    ls.reduceRight(
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
    ns.reduce(
        (a, b, i) => a * ls[i] + b,
        0,
    )

export const arr =
(length: number) =>
    Array.from({ length }, (_, i) => i)
