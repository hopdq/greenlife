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
    return CommonServices;
}());
