import { assertAlmostEquals } from "https://esm.sh/jsr/@std/assert@1.0.13"
import { icdf } from "../src/util/icdf.ts"

Deno.test("icdf", () => {
    const inv = icdf(0, 1)

    assertAlmostEquals(inv(0.5), 0, 1e-6)
    assertAlmostEquals(inv(0.8413), 1, 1e-3)
    assertAlmostEquals(inv(0.9772), 2, 1e-3)
})
