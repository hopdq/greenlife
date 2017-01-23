var CommonServices = (function () {
    function CommonServices() {
    }
    CommonServices.fetchCategoryTree = function () {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/category/navigator');
        $.get(url, function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };
    CommonServices.fetchBannerByPositionPage = function (page, pos) {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('/api/banner/' + page + '/' + pos);
        $.get(url, function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };
    CommonServices.fetchOrderProduct = function (productIds) {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByIds');
        var params = { Ids: productIds };
        $.post(url, params, function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };
    return CommonServices;
}());
//# sourceMappingURL=shared.ajax.js.map