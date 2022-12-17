import { diffLines, Change } from 'diff'
import { TextLine,EMPTY_LINE } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
import { LineStatus } from './line-status-enum'

export function getDiff(oldStr: string, newStr: string): Array<TextLine[]> {
    let changes: Change[] = diffLines(oldStr, newStr);
    console.log(changes)
    // console.log(changes.length)

    var result: Array<TextLine[]> = new Array();

    if (!changes || changes.length == 0) {
        return result;
    }

    var oldLines: TextLine[] = new Array();
    var newLines: TextLine[] = new Array();

    result.push(oldLines);
    result.push(newLines);

    changes.forEach(change => {
        if (!change || !change.count || change.count <= 0) {
            return
        }

        // 新增的元素写入新的行，旧的对应的位置插入空行
        if (change.added) {
            let changedLines: Array<string> = change.value.split("\n");
            for (let i: number = 0; i < change.count; i++) {
                newLines.push(new TextLine(changedLines[i], true, null, LineStatus.ADD));
                oldLines.push(EMPTY_LINE)
            }
            return;
        }

        // 删除的元素写入旧的行，新的对应的位置插入空行
        if (change.removed) {
            let changedLines: Array<string> = change.value.split("\n");
            for (let i = 0; i < change.count; i++) {
                oldLines.push(new TextLine(changedLines[i], true, null, LineStatus.REMOVED));
                newLines.push(EMPTY_LINE)
            }
            return;
        }

        let changedLines: Array<string> = change.value.split("\n");
        for (let i = 0; i < change.count; i++) {
            oldLines.push(new TextLine(changedLines[i], true, null, LineStatus.NORMAL));
            newLines.push(new TextLine(changedLines[i], true, null, LineStatus.NORMAL));
        }
    })

    return result;
}


/**
 * 将diff出的结果中的空行压实，多余的空行删除
 * @param result diff的处理后的结果
 */
export function compactEmptyLines(result: Array<TextLine[]>): ContrastLinesPair[] {
    var compactResult: ContrastLinesPair[] = new Array();
    if (!result || result.length != 2) {
        return compactResult;
    }

    let oldLines = result[0];
    let newLines = result[1];

    let newCompcatLines: TextLine[] = new Array();
    let oldCompcatLines: TextLine[] = new Array();

    let oldIndex = 1;
    let newIndex = 1;
    let linesLength = oldLines.length;
    for (let i = 0; i < linesLength; i++) {
        if (oldLines[i].status == LineStatus.REMOVED) {
            oldLines[i].index = oldIndex++;
            oldCompcatLines.push(oldLines[i]);
        }

        if (newLines[i].status == LineStatus.ADD) {
            newLines[i].index = newIndex++;
            newCompcatLines.push(newLines[i]);
        }

        if (oldLines[i].status == LineStatus.NORMAL && newLines[i].status == LineStatus.NORMAL) {
            alignLinesAndPush(oldCompcatLines, newCompcatLines, compactResult);

            // 连续的相同的行为一组
            let tempNewLines: TextLine[] = new Array();
            let tempOldLines: TextLine[] = new Array();

            while (i < linesLength && oldLines[i].status == LineStatus.NORMAL && newLines[i].status == LineStatus.NORMAL) {
                oldLines[i].index = oldIndex++;
                tempOldLines.push(oldLines[i]);

                newLines[i].index = newIndex++;
                tempNewLines.push(newLines[i]);

                i++;
            }

            // 这里需要把while中 i-1，因为for循环中会执行 i++,会多加一次 
            i--;
            compactResult.push(new ContrastLinesPair(tempOldLines, tempNewLines));

            newCompcatLines = new Array();
            oldCompcatLines = new Array();
        }
    }

    alignLinesAndPush(oldCompcatLines, newCompcatLines, compactResult);

    return compactResult;
}

/**
 * 从新老diff对比列别中提取新老字符串
 * @param pairs  格式化的对比行
 * @returns 新老字符串
 */
export function getDiffStrFromPairs(pairs: Array<ContrastLinesPair>): Map<string, string> {
    let result: Map<string, string> = new Map();
    if (pairs == null || pairs.length == 0) {
        result.set('old', '');
        result.set('new', '');
        return result;
    }

    let oldStr: string = '';
    let newStr: string = '';

    let pairsLen = pairs.length;
    for (let i = 0; i < pairsLen; i++) {
        let oldLines = pairs[i].oldLines;
        let newLines = pairs[i].newLines;

        for (let j = 0; j < oldLines.length; j++) {
            if (oldLines[j].status != LineStatus.EMPTY) {
                oldStr = oldStr + oldLines[j].value + '\n';
            }
            if (newLines[j].status != LineStatus.EMPTY) {
                newStr = newStr + newLines[j].value + '\n';
            }
        }
    }

    result.set('old', oldStr);
    result.set('new', newStr);

    return result;
}
function alignLinesAndPush(oldCompcatLines: TextLine[], newCompcatLines: TextLine[], compactResult: ContrastLinesPair[]) {
    if (oldCompcatLines.length < newCompcatLines.length) {
        let emptyLineNum = newCompcatLines.length - oldCompcatLines.length
        for (let i = 0; i < emptyLineNum; i++) {
            oldCompcatLines.push(EMPTY_LINE);
        }
    }
    if (oldCompcatLines.length > newCompcatLines.length) {
        let emptyLineNum = oldCompcatLines.length - newCompcatLines.length
        for (let i = 0; i < emptyLineNum; i++) {
            newCompcatLines.push(EMPTY_LINE);
        }
    }
    if (oldCompcatLines.length > 0 && newCompcatLines.length > 0) {
        compactResult.push(new ContrastLinesPair(oldCompcatLines, newCompcatLines));
    }
}