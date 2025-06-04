import { Lang } from "./src/Lang.ts"
import { arr } from "./src/util.ts"

const lang = new Lang(0.6)
console.log(
    arr(10).map(i => lang.generate(2, i)).join("\n")
)
