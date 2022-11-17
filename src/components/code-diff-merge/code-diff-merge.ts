import { diffLines, Change } from 'diff'
import { TextLine } from './text-line'

export function getDiff(oldStr: string, newStr: string,): Array<TextLine[]> {
    let changes: Change[] = diffLines(oldStr, newStr);
    console.log(changes)
    console.log(changes.length)

    var result: Array<TextLine[]> = new Array();

    if (!changes || changes.length == 0) {
        return result;
    }

    var oldLines: TextLine[] = new Array();
    var newLines: TextLine[] = new Array();

    result.push(oldLines);
    result.push(newLines);

    changes.forEach(e=>{
        
    })

    var line = new TextLine('sds', true, 1);
    line.add = true;
    oldLines.push(line);
    console.log(oldLines);

    return result;
}

export default getDiff
