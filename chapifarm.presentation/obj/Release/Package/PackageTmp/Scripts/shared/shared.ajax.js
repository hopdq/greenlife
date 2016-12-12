var commonServices = {}
commonServices.fetchCategoryTree = function () {
    var dfd = $.Deferred();
    var url = utilities.buildUrl('api/category/navigator');
    $.get(url, function (data) {
        dfd.resolve(data);
    });
    return dfd.promise();
}