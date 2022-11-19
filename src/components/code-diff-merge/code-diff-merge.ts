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

    let index = 0;
    changes.forEach(change => {
        if (!change || !change.count || change.count <= 0) {
            return
        }

        // 新增的元素写入新的行，旧的对应的位置插入空行
        if (change.added) {
            let changedLines: Array<string> = change.value.split("\n");
            for (let i: number = 0; i < change.count; i++) {
                index++;
                let line = new TextLine(changedLines[i], true, index);
                line.add = true;
                newLines.push(line);

                let emptyLine = new TextLine('', true, index);
                oldLines.push(emptyLine)
            }
            return;
        }

        // 删除的元素写入旧的行，新的对应的位置插入空行
        if (change.removed) {
            let changedLines: Array<string> = change.value.split("\n");
            for (let i = 0; i < change.count; i++) {
                index++;
                let line = new TextLine(changedLines[i], true, index);
                line.removed = true;
                oldLines.push(line);

                let emptyLine = new TextLine('', true, index);
                newLines.push(emptyLine)
            }
            return;
        }

        let changedLines: Array<string> = change.value.split("\n");
        for (let i = 0; i < change.count; i++) {
            index++;
            let line = new TextLine(changedLines[i], true, index);
            oldLines.push(line);
            newLines.push(line);
        }
    })

    return result;
}


/**
 * 讲diff出的结果中的空行压实，多余的空行删除
 * @param result diff的处理后的结果
 */
export function compactEmptyLines(result: Array<TextLine[]>) {
    if (!result || result.length != 2) {
        return;
    }

    let oldLines = result[0];
    let newLines = result[1];

    let finalFlag = new TextLine('', false, -1);
    oldLines.push(finalFlag);
    newLines.push(finalFlag);

    let newCompcat: TextLine[] = new Array();
    let oldCompcat: TextLine[] = new Array();

    let start = 0;

    for (let i = 0; i < oldLines.length; i++) {
        if (oldLines[i].add || oldLines[i].removed) {
            continue;
        }

        // 压缩未变换的行之间的改变的行，主要是去掉多余的空行 
        compact(start, i - 1, newCompcat, oldCompcat, newLines, oldLines);
        // 处理为变换的行，移动指针
        let j;
        for (j = i; j < oldLines.length; j++) {
            if (oldLines[j].add || oldLines[j].removed) {
                start = j;
                break;
            }
            newCompcat.push(newLines[j]);
            oldCompcat.push(oldLines[j]);
        }
        i = j - 1;
    }
}


function compact(start: number, end: number, newCompcat: TextLine[], oldCompcat: TextLine[], newLines: TextLine[], oldLines: TextLine[]) {
    if (end < start) {
        return;
    }

    for (let i = start; i <= end; i++) {

    }
}