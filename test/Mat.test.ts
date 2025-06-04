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

Deno.test("gets", () => {
    assertEquals(
        pipe(
            Mat.fromDimension([2, 3]),
            x => x.gets([1, null]),
        ),
        new Mat([3], [1, 3, 5])
    )
})

Deno.test("groupBy", () => {
    assertEquals(
        pipe(
            Mat.fromDimension([2, 3]),
            x => x.groupBy(v => v % 4),
        ),
        new Map([
            [0, [0, 4]],
            [1, [1, 5]],
            [2, [2]],
            [3, [3]],
        ]),
    )
})

Deno.test("groupByAxis", () => {
    assertEquals(
        pipe(
            Mat.fromDimension([2, 3]),
            x => x.groupByAxis(0),
        ),
        new Mat([2], [
            [0, 2, 4],
            [1, 3, 5],
        ]),
    )
    assertEquals(
        pipe(
            Mat.fromDimension([2, 3]),
            x => x.groupByAxis(1),
        ),
        new Mat([3], [
            [0, 1],
            [2, 3],
            [4, 5],
        ]),
    )
})

Deno.test("sumByAxis", () => {
    assertEquals(
        pipe(
            Mat.fromDimension([2, 3]),
            x => x.sumByAxis(0),
        ),
        new Mat([2], [6, 9]),
    )
    assertEquals(
        pipe(
            Mat.fromDimension([2, 3]),
            x => x.sumByAxis(1),
        ),
        new Mat([3], [1, 5, 9]),
    )
})

Deno.test("fromSelections", () => {
    assertEquals(
        Mat.fromSelections([
            ["Hello", "Goodbye"],
            ["World", "My Dear"],
        ] as const)
        .map(([a, b]) => `${a}, ${b}` as const)
        .toArray(),
        [
            "Hello, World",
            "Goodbye, World",
            "Hello, My Dear",
            "Goodbye, My Dear",
        ],
    )
})
