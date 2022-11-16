export class TextLine {
    add: boolean = false;
    removed: boolean = false;
    value: string;
    display: boolean;
    index: number;
    constructor(value: string, display: boolean, index: number) {
        this.value = value;
        this.display = display;
        this.index = index;
    }
}

