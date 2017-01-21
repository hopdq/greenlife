var Order;
(function (Order) {
    var Product = (function () {
        function Product(id, countProduct) {
            this.id = ko.observable(id);
            this.countProduct = ko.observable(countProduct);
        }
        return Product;
    }());
    Order.Product = Product;
})(Order || (Order = {}));
