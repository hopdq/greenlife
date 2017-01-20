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
        self.hotLine = ko.observable("Chưa cập nhật");
        self.openTime = ko.observable("Các ngày trong tuần");
        self.cart = ko.observable(new Cart());
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
var Cart = (function () {
    function Cart() {
        var self = this;
        self.orderLine = ko.observableArray([]);
        self.totalProduct = ko.computed(function () {
            var totalProduct = 0;
            for (var i = 0; i < self.orderLine().length; i++) {
                totalProduct += self.orderLine()[i].productCount();
            }
            return totalProduct;
        });
        self.totalPrice = ko.computed(function () {
            var totalPrice = 0;
            for (var i = 0; i < self.orderLine().length; i++) {
                totalPrice += self.orderLine()[i].product().price() * self.orderLine()[i].productCount();
            }
            return totalPrice;
        });
        self.noneProduct = ko.computed(function () {
            return self.totalProduct() == 0;
        });
    }
    Cart.prototype.remove = function (orderLine) {
        this.orderLine.remove(orderLine);
    };
    Cart.prototype.add = function (product) {
        for (var i = 0; i < this.orderLine.length; i++) {
            if (this.orderLine()[i].product().id() == product.id()) {
                this.orderLine()[i].increase();
            }
            else {
                var orderLine = new OrderLine(product);
                this.orderLine().push(orderLine);
            }
        }
    };
    return Cart;
}());
var OrderLine = (function () {
    function OrderLine(product) {
        this.productCount = ko.observable(1);
        this.product = ko.observable(product);
    }
    OrderLine.prototype.increase = function () {
        var self = this;
        this.productCount = ko.computed(function () {
            return self.productCount() + 1;
        });
    };
    OrderLine.prototype.decrease = function () {
        var self = this;
        this.productCount = ko.computed(function () {
            return self.productCount() - 1;
        });
    };
    return OrderLine;
}());
jQuery(document).ready(function ($) {
    var header_height = $('header').outerHeight();
    $(window).scroll(function () {
        // Nếu cuộn được hơn 150px rồi
        if ($(this).scrollTop() >= header_height) {
            $(".header-fixed").addClass("topmainmenu");
        }
        else {
            $(".header-fixed").removeClass("topmainmenu");
        }
    });
});
