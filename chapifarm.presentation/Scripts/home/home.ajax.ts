class HomeServices {
    static getProductByCategory(cateId: string): JQueryPromise<Array<ProductDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByCategory/' + cateId + '/' + DateGetInfoEnum.HomeProductGetNumber);
        $.get(url, function (data: Array<ProductDto>) {
            dfd.resolve(data);
        });
        return dfd.promise();
    }
}