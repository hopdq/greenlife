class HomeServices {
    static getProductByCategory(cateId: string, take: number): JQueryPromise<Array<ProductDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByCategory/' + cateId + '/' + take);
        $.get(url, function (data: Array<ProductDto>) {
            dfd.resolve(data);
        });
        return dfd.promise();
    }
}