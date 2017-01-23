$(function () {
    var bodyModel = new Order.OrderBody();
    var viewModel = new Layout(bodyModel);
    ko.applyBindings(viewModel);
    viewModel.init();
});
var Order;
(function (Order) {
    var OrderBody = (function () {
        function OrderBody() {
        }
        OrderBody.prototype.init = function () { };
        return OrderBody;
    }());
    Order.OrderBody = OrderBody;
    var Product = (function () {
        function Product(id, countProduct) {
            this.id = ko.observable(id);
            this.countProduct = ko.observable(countProduct);
        }
        return Product;
    }());
    Order.Product = Product;
})(Order || (Order = {}));
//# sourceMappingURL=order.knockout.js.map