import { assertEquals } from "https://esm.sh/jsr/@std/assert@1.0.13"
import { Mat } from "../src/Mat.ts"
import {
    arr,
    hash,
    n2ns,
    ns2n,
    pipe,
} from "../src/util.ts"

Deno.test("n2ns, ns2n", () => {
    const dimension = [2, 3]
    assertEquals(
        arr(6).map(n => n2ns(dimension)(n)),
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
            [0, 2],
            [1, 2],
        ],
    )
    assertEquals(
        arr(6)
            .map(n => n2ns(dimension)(n))
            .map(ns => ns2n(dimension)(ns)),
        arr(6),
    )
})

Deno.test("basic", () => {
    assertEquals(
        pipe(
            new Mat([2, 3]),
            x => x.gets([1, null]),
        ),
        new Mat([3], [1, 3, 5])
    )
})
