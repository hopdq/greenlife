var HomeServices = (function () {
    function HomeServices() {
    }
    HomeServices.getProductByCategory = function (cateId, take) {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByCategory/' + cateId + '/' + take);
        $.get(url, function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };
    return HomeServices;
}());
