class CommonServices {
    static fetchCategoryTree(): JQueryPromise<Array<CategoryDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/category/navigator');
        $.get(url, function (data: Array<CategoryDto>) {
            dfd.resolve(data);
        });
        return dfd.promise();
    }
    static fetchBannerByPositionPage(page: string, pos: string): JQueryPromise<Array<BannerDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('/api/banner/' + page + '/' + pos);
        $.get(url, function (data: Array<Banner>) {
            dfd.resolve(data);
        });
        return dfd.promise();
    }
    static fetchOrderProduct(productIds: Array<string>): JQueryPromise<Array<ProductDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByIds');
        var params = { Ids: productIds };
        $.post(url, params, function (data: Array<ProductDto>) {
            dfd.resolve(data);
        })
        return dfd.promise();
    }
}
