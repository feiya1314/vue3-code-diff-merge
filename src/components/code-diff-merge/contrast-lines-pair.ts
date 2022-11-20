import { TextLine } from './text-line'

export class ContrastLinesPair {
    oldLines: TextLine[];
    newLines: TextLine[];

    constructor(oldLines: TextLine[], newLines: TextLine[]) {
        this.oldLines = oldLines;
        this.newLines = newLines;
    }
}