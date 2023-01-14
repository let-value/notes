export class Item<TDirectory extends boolean = any> {
    constructor(public path: string, public name: string, public isDirectory: TDirectory) {}
}
