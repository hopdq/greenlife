namespace Order {
    export class Product {
        id: KnockoutObservable<string>;
        countProduct: KnockoutObservable<number>;
        constructor(id: string, countProduct: number) {
            this.id = ko.observable(id);
            this.countProduct = ko.observable(countProduct);
        }
    }
}