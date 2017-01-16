var HomeServices = (function () {
    function HomeServices() {
    }
    HomeServices.getProductByCategory = function (cateId) {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByCategory/' + cateId + '/' + DateGetInfoEnum.HomeProductGetNumber);
        $.get(url, function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };
    return HomeServices;
}());
