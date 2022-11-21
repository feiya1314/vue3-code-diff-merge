import { TextLine } from './text-line'

/**
 * 同一组diff changs结果（解析成独立的行），如果diff后没变化，则两个相同，如果有变化
 * 例如 abc -> abd ,则 changs结果有两条，一个 old : abc removed,一个 new : abd add状态
 * oldLines 和 newLines 数组元素数一致，不足的用空行占位
 */
export class ContrastLinesPair {
    oldLines: TextLine[];
    newLines: TextLine[];

    constructor(oldLines: TextLine[], newLines: TextLine[]) {
        this.oldLines = oldLines;
        this.newLines = newLines;
    }
}