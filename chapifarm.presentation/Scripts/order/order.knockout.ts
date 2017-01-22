$(function () {
    var bodyModel = new Order.OrderBody();
    var viewModel = new Layout<Order.OrderBody>(bodyModel);
    ko.applyBindings(viewModel);
    viewModel.init();
});

namespace Order {
    export class OrderBody implements BaseBody {
        init(): void { }
    }
    export class Product {
        id: KnockoutObservable<string>;
        countProduct: KnockoutObservable<number>;
        constructor(id: string, countProduct: number) {
            this.id = ko.observable(id);
            this.countProduct = ko.observable(countProduct);
        }
    }
}