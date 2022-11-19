import { LineStatus } from './line-status-enum'
export class TextLine {
    status: LineStatus;
    value: string | null;
    display: boolean;
    index: number;
    constructor(value: string | null, display: boolean, index: number, status: LineStatus) {
        this.value = value;
        this.display = display;
        this.index = index;
        this.status = status;
    }
}

