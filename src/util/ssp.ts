const phonemesData = `
    a,e,i,u,o
    j,w
    l,r
    m,n
    v,z
    f,s
    b,d,g,p,t,k
`
    .trim()
    .split("\n")
    .map(x => x.trim().split(","))
    .reverse()

const vowelSonority = phonemesData.length-1

export const ssp =
(sonorities: number[]) => {
    let dir = 1
    let prev = -2
    let sylEnd = false
    for (const curr of sonorities) {
        sylEnd = false
        if (prev == curr) return false
        if (dir == 1) {
            if (prev > curr) {
                if (prev == vowelSonority) {
                    dir = -1
                } else {
                    return false
                }
            }
        }
        if (dir == -1) {
            if (prev < curr) {
                dir = 1
                sylEnd = true
            }
        }
        prev = curr
    }
    return sylEnd ? "sylEnd" : true
}
