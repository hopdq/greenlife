class BaseModel {
    //static baseApiUrl: string = 'http://services.chapifarm.com/';
    static baseApiUrl: string = 'http://services.chapifarm.com/';
    static baseWebUrl: string = 'http://chapifarm.com/';
    static baseImgUrl: string = 'http://admin.chapifarm.com/';
}
class Layout<T extends BaseBody> {
    header: KnockoutObservable<Header>;
    body: KnockoutObservable<T>;
    constructor(body: T) {
        var self = this;
        self.header = ko.observable(new Header());
        self.body = ko.observable(body);
    }
    init() {
        var self = this;
        self.header().init();
        self.body().init();
    }
}
class Header {
    navigation: KnockoutObservableArray<Category>;
    hotLine: KnockoutObservable<string>;
    openTime: KnockoutObservable<string>;
    cart: KnockoutObservable<Cart>;
    constructor() {
        var self = this;
        self.hotLine = ko.observable("Chưa cập nhật");
        self.openTime = ko.observable("Các ngày trong tuần");
        self.cart = ko.observable(new Cart());
        self.navigation = ko.observableArray([]);
    }
    init() {
        var self = this;
        CommonServices.fetchCategoryTree().done(function (categories: Array<CategoryDto>) {
            if (categories != null && categories.length > 0) {
                $.each(categories, function (idx: number, cate: CategoryDto) {
                    self.navigation.push(new Category(cate));
                });
            }
        });
    }
}
interface BaseBody {
    init();
}
class Category {
    id: KnockoutObservable<string>;
    name: KnockoutObservable<string>;
    url: KnockoutObservable<string>;
    hasChild: KnockoutObservable<boolean>;
    hasSubClass: KnockoutObservable<string>;
    children: KnockoutObservableArray<Category>;
    constructor(dto: CategoryDto) {
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
}
class Banner {
    id: KnockoutObservable<string>;
    text: KnockoutObservable<string>;
    imgPath: KnockoutObservable<string>;
    link: KnockoutObservable<string>;
    constructor(dto: BannerDto) {
        this.id = ko.observable(dto.Id);
        this.text = ko.observable(dto.Text);
        this.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImgPath));
        this.link = ko.observable(dto.Link)
    }
}
class Cart {
    orderLine: KnockoutObservableArray<OrderLine>;
    totalProduct: KnockoutObservable<number>;
    totalPrice: KnockoutObservable<number>;
    noneProduct: KnockoutObservable<boolean>;
    constructor() {
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
        })
    }
    remove(orderLine: OrderLine) {
        this.orderLine.remove(orderLine);
    }
    add(product: Product) {
        for (var i = 0; i < this.orderLine.length; i++) {
            if (this.orderLine()[i].product().id() == product.id()) {
                this.orderLine()[i].increase();
            } else {
                var orderLine = new OrderLine(product);
                this.orderLine().push(orderLine);
            }
        }
    }
}
class OrderLine {
    productCount: KnockoutObservable<number>;
    product: KnockoutObservable<Product>;
    constructor(product: Product) {
        this.productCount = ko.observable(1);
        this.product = ko.observable(product);
    }
    increase() {
        var self = this;
        this.productCount = ko.computed(function () {
            return self.productCount() + 1;
        })
    }
    decrease() {
        var self = this;
        this.productCount = ko.computed(function () {
            return self.productCount() - 1;
        })
    }
}
jQuery(document).ready(function ($) {
    var header_height = $('header').outerHeight();
    $(window).scroll(function () {
        // Nếu cuộn được hơn 150px rồi
        if ($(this).scrollTop() >= header_height) {
            $(".header-fixed").addClass("topmainmenu");
        } else {
            $(".header-fixed").removeClass("topmainmenu");
        }
    }
    )
})