export class Url {
    id: string;
    url: string;
    html = "";
    constructor(id: string, url: string) {
        this.id = id;
        this.url = url;
    }
}