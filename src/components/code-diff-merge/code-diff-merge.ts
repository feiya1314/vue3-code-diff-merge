import { diffLines } from 'diff'
import { TextLine } from './text-line'

export function getDiff(oldStr: string, newStr: string) {
    var diffContent = diffLines(oldStr, newStr);
    console.log(diffContent)

    var oldLines: TextLine[] = new Array();

    var line = new TextLine('sds', true, 1);
    line.add = true;
    oldLines.push(line);
    console.log(oldLines);
}

export default getDiff
