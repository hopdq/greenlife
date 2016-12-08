var baseModel = {
    baseUrl: ''
}
function Layout(body) {
    var self = this;
    self.header = ko.observable(new Header());
    self.body = body;
    self.init = function () {
        self.header().init();
        self.body().init();
    }
}
function Header() {
    var self = this;
    self.navigation = ko.observableArray([]);
    self.init = function () {
        commonServices.fetchCategoryTree().done(function (categories) {
            if (categories != null && categories.length > 0) {
                $.each(categories, function (idx, lv1) {
                    self.navigation.push(new Category(lv1));
                });
            }
        });
    }
}
function Category(dto) {
    var self = this;
    self.id = ko.observable(dto.Id);
    self.name = ko.observable(dto.Name);
    self.url = ko.observable(dto.Url);
    self.hasChild = ko.observable(dto.Children.length > 0);
    self.hasSubClass = self.hasChild() ? 'has-sub' : '';
    self.children = ko.observableArray([]);
    $.each(dto.Children, function (idx, child) {
        self.children.push(new Category(child));
    });
}
