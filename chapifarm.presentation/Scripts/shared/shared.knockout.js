var BaseModel = (function () {
    function BaseModel() {
    }
    //static baseApiUrl: string = 'http://services.chapifarm.com/';
    BaseModel.baseApiUrl = 'http://services.chapifarm.com/';
    BaseModel.baseWebUrl = 'http://chapifarm.com/';
    BaseModel.baseImgUrl = 'http://admin.chapifarm.com/';
    return BaseModel;
}());
var Layout = (function () {
    function Layout(body) {
        var self = this;
        self.header = ko.observable(new Header());
        self.body = ko.observable(body);
    }
    Layout.prototype.init = function () {
        var self = this;
        self.header().init();
        self.body().init();
    };
    return Layout;
}());
var Header = (function () {
    function Header() {
        var self = this;
        self.navigation = ko.observableArray([]);
    }
    Header.prototype.init = function () {
        var self = this;
        CommonServices.fetchCategoryTree().done(function (categories) {
            if (categories != null && categories.length > 0) {
                $.each(categories, function (idx, cate) {
                    self.navigation.push(new Category(cate));
                });
            }
        });
    };
    return Header;
}());
var Category = (function () {
    function Category(dto) {
        var self = this;
        self.id = ko.observable(dto.Id);
        self.name = ko.observable(dto.Name);
        self.url = ko.observable(dto.Url);
        self.hasChild = ko.observable(dto.Children != null && dto.Children.length > 0);
        self.hasSubClass = ko.observable(self.hasChild() ? 'has-sub' : '');
        self.children = ko.observableArray([]);
        if (self.hasChild()) {
            $.each(dto.Children, function (idx, child) {
                self.children.push(new Category(child));
            });
        }
    }
    return Category;
}());
var Banner = (function () {
    function Banner(dto) {
        this.id = ko.observable(dto.Id);
        this.text = ko.observable(dto.Text);
        this.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImgPath));
        this.link = ko.observable(dto.Link);
    }
    return Banner;
}());
