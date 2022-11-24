export class EmsBuffer {
    buffer = '';
    constructor() {}
    append(content: string) {
        if (this.buffer.length > 0) {
            this.buffer += ',';
        }
        this.buffer += content;
    }

    getValue(): string {


        return this.buffer;
    }
}
