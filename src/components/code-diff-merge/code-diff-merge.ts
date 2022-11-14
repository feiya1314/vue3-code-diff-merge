import { diffLines } from 'diff'


export function getDiff(oldStr: string, newStr: string) {
    var diffContent = diffLines(oldStr, newStr);
    console.log(diffContent)
}

export default getDiff
