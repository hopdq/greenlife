var commonServices = {}
commonServices.fetchCategoryTree = function () {
    var dfd = $.Deferred();
    var url = utilities.buildUrl('api/Category/Fetch');
    $.get(url, function (data) {
        dfd.resolve(data);
    });
    return dfd.promise();
}