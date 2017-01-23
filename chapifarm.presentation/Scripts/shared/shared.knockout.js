var BaseModel = (function () {
    function BaseModel() {
    }
    //static baseApiUrl: string = 'http://services.chapifarm.com/';
    BaseModel.baseApiUrl = 'http://192.168.0.100:8096/';
    BaseModel.baseWebUrl = 'http://chapifarm.com/';
    //static baseImgUrl: string = 'http://admin.chapifarm.com/';
    BaseModel.baseImgUrl = 'http://192.168.0.100:8088/';
    return BaseModel;
}());
var Layout = (function () {
    function Layout(body) {
        var self = this;
        self.header = ko.observable(new Header());
        self.body = ko.observable(body);
        self.footer = ko.observable(new Footer());
    }
    Layout.prototype.init = function () {
        var self = this;
        self.header().init();
        self.body().init();
        self.footer().init();
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
        self.cart().init();
    };
    return Header;
}());
var Footer = (function () {
    function Footer() {
        var self = this;
        self.aroundFarm = ko.observable(new AroundFarm());
        self.showroom = ko.observable(new Showroom());
    }
    Footer.prototype.init = function () {
        var self = this;
        self.initChapiAround();
        self.initShowroom();
    };
    Footer.prototype.initChapiAround = function () {
        var self = this;
        var cpa = new AroundFarm();
        var temp = ['Nhà máy trà cổ', 'Đồi trà Cầu Đất Farm', 'Vườn rau thủy canh', 'Khu vườn sen đá'];
        for (var j = 0; j < temp.length; j++) {
            var aTag = new ATag();
            aTag.name(temp[j]);
            aTag.href("https://caudatfarm.com/");
            cpa.collections.push(aTag);
        }
        var aroundBanner = [];
        for (var i = 0; i < 10; i++) {
            var bdto = new BannerDto();
            bdto.Id = i + "";
            bdto.Link = "https://caudatfarm.com/";
            bdto.Text = "banner: " + i;
            (i % 2) == 0 ? bdto.ImgPath = "https://hstatic.net/704/1000059704/1000208939/tab_footer_1_img_3.jpg?v=426" : bdto.ImgPath = "https://hstatic.net/704/1000059704/1000208939/tab_footer_1_img_7.jpg?v=426";
            var bn = new Banner(bdto);
            cpa.banner.push(bn);
        }
        self.aroundFarm(cpa);
    };
    Footer.prototype.initShowroom = function () {
        var self = this;
        //fake data
        var sr = new Showroom();
        for (var i = 0; i < 10; i++) {
            var bdto = new BannerDto();
            bdto.Id = i + "";
            bdto.Link = "https://caudatfarm.com/";
            bdto.Text = "banner: " + i;
            (i % 2) == 0 ? bdto.ImgPath = "https://hstatic.net/704/1000059704/1000208939/tab_footer_2_img_3.jpg?v=426" : bdto.ImgPath = "https://hstatic.net/704/1000059704/1000208939/tab_footer_2_img_3.jpg?v=426";
            var bn = new Banner(bdto);
            sr.banners.push(bn);
        }
        self.showroom(sr);
    };
    return Footer;
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
        //this.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImgPath));
        this.imgPath = ko.observable(dto.ImgPath);
        this.link = ko.observable(dto.Link);
    }
    return Banner;
}());
var Cart = (function () {
    function Cart() {
        var self = this;
        self.orderLine = ko.observableArray([]);
        self.cookie = ko.observable(new CartCookie());
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
    Cart.prototype.init = function () {
        var self = this;
        //var orderList = self.cookie().fetch();
        //var productIdArr = new Array<string>();
        //for (var i = 0; i < orderList.length; i++) {
        //    productIdArr.push(orderList()[i].id());
        //}
        var productIdArr = ['PC0D3B4932D55B4', 'PC2986F10A7F624', 'PC622AD417B3AF4'];
        CommonServices.fetchOrderProduct(productIdArr).done(function (productDtos) {
            if (productDtos != null) {
                $.each(productDtos, function (idx, productDto) {
                    var product = new Product(productDto);
                    self.add(product);
                });
            }
        });
    };
    Cart.prototype.remove = function (orderLine) {
        this.orderLine.remove(orderLine);
        this.cookie().remove(orderLine.product().id());
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
            this.cookie().add(product.id());
        }
    };
    return Cart;
}());
var OrderLine = (function () {
    function OrderLine(product) {
        var self = this;
        self.productCount = ko.observable(1);
        self.product = ko.observable(product);
        self.linePrice = ko.computed(function () {
            return product.price() * self.productCount();
        });
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
var AroundFarm = (function () {
    function AroundFarm() {
        var self = this;
        self.title = ko.observable("Chapi Farm - Nông Trại Ba Vì");
        self.collections = ko.observableArray([]);
        self.banner = ko.observableArray([]);
    }
    AroundFarm.prototype.init = function () {
        var self = this;
    };
    return AroundFarm;
}());
var Showroom = (function () {
    function Showroom() {
        var self = this;
        self.title = ko.observable("- Phạm Hùng");
        self.banners = ko.observableArray([]);
    }
    return Showroom;
}());
var ATag = (function () {
    function ATag() {
        var self = this;
        self.name = ko.observable("");
        self.href = ko.observable("");
    }
    return ATag;
}());
//# sourceMappingURL=shared.knockout.js.map