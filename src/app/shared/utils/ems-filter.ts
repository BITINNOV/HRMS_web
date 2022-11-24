export class EmsFIlter {
    filter = '';
    constructor() {}

    append(content: string) {
        this.filter += content;
    }

    getValue(): string {


        return this.filter;
    }
}
