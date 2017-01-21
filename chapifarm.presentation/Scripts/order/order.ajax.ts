class OrderServices {
    static fetchOrderProduct(productIds: Array<string>): JQueryPromise<Array<ProductDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByIds');
        var params = productIds;
        $.post(url, params, function (data: Array<ProductDto>) {
            dfd.resolve(data);
        })
        return dfd.promise();
    }
}