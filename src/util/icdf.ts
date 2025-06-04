/*
    Ref:
    (Abramowitz & Stegun, 1964)
    https://www.johndcook.com/blog/normal_cdf_inverse/
*/

export const icdf =
(mean: number, stddev: number) =>
(p: number) => {
    if (p <= 0 || p >= 1) throw new Error("p must be in (0, 1)")

    const a1 = 2.515517
    const a2 = 0.802853
    const a3 = 0.010328

    const b1 = 1.432788
    const b2 = 0.189269
    const b3 = 0.001308

    const t = Math.sqrt(-2 * Math.log(Math.min(p, 1 - p)))
    const z = t -
        (a1 + a2 * t + a3 * t * t)
        / (1 + b1 * t + b2 * t * t + b3 * t * t * t)
    const sign = p < 0.5 ? -1 : 1

    return mean + stddev * sign * z
}
