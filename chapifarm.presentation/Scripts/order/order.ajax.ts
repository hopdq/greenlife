
class OrderServices {
    static fetchOrderProduct(productIds: Array<string>): JQueryPromise<Array<ProductDto>> {
        var dfd = $.Deferred();
        var url = Utilities.buildApiUrl('api/products/productsByIds');
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(productIds),
            success: function (response) {
                dfd.resolve(response);
            },
            error: function (response) {
                console.log(response);
            }
        });
        return dfd.promise();
    }
}