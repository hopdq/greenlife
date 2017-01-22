var OrderServices = (function () {
    function OrderServices() {
    }
    OrderServices.fetchOrderProduct = function (productIds) {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByIds');
        var params = productIds;
        $.post(url, params, function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };
    return OrderServices;
}());
