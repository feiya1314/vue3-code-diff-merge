import { diffLines, Change } from 'diff'
import { TextLine } from './text-line'
import { LineStatus } from './line-status-enum'

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
                let line = new TextLine(changedLines[i], true, index, LineStatus.ADD);
                newLines.push(line);

                let emptyLine = new TextLine(null, true, -1, LineStatus.EMPTY);
                oldLines.push(emptyLine)
            }
            return;
        }

        // 删除的元素写入旧的行，新的对应的位置插入空行
        if (change.removed) {
            let changedLines: Array<string> = change.value.split("\n");
            for (let i = 0; i < change.count; i++) {
                index++;
                let line = new TextLine(changedLines[i], true, index, LineStatus.REMOVED);
                oldLines.push(line);

                let emptyLine = new TextLine(null, true, -1, LineStatus.EMPTY);
                newLines.push(emptyLine)
            }
            return;
        }

        let changedLines: Array<string> = change.value.split("\n");
        for (let i = 0; i < change.count; i++) {
            index++;
            let line = new TextLine(changedLines[i], true, index, LineStatus.NORMAL);
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
        return result;
    }

    let oldLines = result[0];
    let newLines = result[1];

    var result: Array<TextLine[]> = new Array();

    let newCompcat: TextLine[] = new Array();
    let oldCompcat: TextLine[] = new Array();

    result.push(oldCompcat);
    result.push(newCompcat);

    for (let i = 0; i < oldLines.length; i++) {
        if (oldLines[i].status == LineStatus.REMOVED) {
            oldCompcat.push(oldLines[i]);
        }

        if (newLines[i].status == LineStatus.ADD) {
            newCompcat.push(newLines[i]);
        }

        if (oldLines[i].status == LineStatus.NORMAL && newLines[i].status == LineStatus.NORMAL) {
            if (oldCompcat.length < newCompcat.length) {
                let emptyLineNum = newCompcat.length - oldCompcat.length
                for (let i = 0; i < emptyLineNum; i++) {
                    oldCompcat.push(new TextLine(null, true, -1, LineStatus.EMPTY));
                }
            }
            if (oldCompcat.length > newCompcat.length) {
                let emptyLineNum = oldCompcat.length - newCompcat.length
                for (let i = 0; i < emptyLineNum; i++) {
                    newCompcat.push(new TextLine(null, true, -1, LineStatus.EMPTY));
                }
            }
            oldCompcat.push(oldLines[i]);
            newCompcat.push(newLines[i]);
        }
    }

    return result;
}