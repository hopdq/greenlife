class BaseModel {
    //static baseApiUrl: string = 'http://services.chapifarm.com/';
    static baseApiUrl: string = 'http://192.168.0.119:8096/';
    static baseWebUrl: string = 'http://chapifarm.com/';
    //static baseImgUrl: string = 'http://admin.chapifarm.com/';
    static baseImgUrl: string = 'http://192.168.0.119:8088/';
}
class Layout<T extends BaseBody> {
    header: KnockoutObservable<Header>;
    body: KnockoutObservable<T>;
    footer: KnockoutObservable<Footer>;
    constructor(body: T) {
        var self = this;
        self.header = ko.observable(new Header());
        self.body = ko.observable(body);
        self.footer = ko.observable(new Footer());
    }
    init() {
        var self = this;
        self.header().init();
        self.body().init();
        self.footer().init();
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
        self.cart().init();
    }
}
class Footer {
    aroundFarm: KnockoutObservable<AroundFarm>;
    showroom: KnockoutObservable<Showroom>;
    categoryFooter: KnockoutObservableArray<Category>;
    contactInfo: KnockoutObservable<String>;
    constructor() {
        var self = this;
        self.aroundFarm = ko.observable(new AroundFarm());
        self.showroom = ko.observable(new Showroom());
    }
    init() {
        var self = this;
        self.initChapiAround();
        self.initShowroom();
    }
    initChapiAround() {
        var self = this;
        var cpa = new AroundFarm();
        var temp = ['Nhà máy trà cổ', 'Đồi trà Cầu Đất Farm', 'Vườn rau thủy canh', 'Khu vườn sen đá'];
        for (var j = 0; j < temp.length; j++){
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
    }
    initShowroom() {
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
        //this.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImgPath));
        this.imgPath = ko.observable(dto.ImgPath);
        this.link = ko.observable(dto.Link)
    }
}
class Cart {
    orderLine: KnockoutObservableArray<OrderLine>;
    totalProduct: KnockoutObservable<number>;
    totalPrice: KnockoutObservable<number>;
    noneProduct: KnockoutObservable<boolean>;
    cookie: KnockoutObservable<CartCookie>;
    constructor() {
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
        })
    }
    init() {
        var self = this;
        //var orderList = self.cookie().fetch();
        //var productIdArr = new Array<string>();
        //for (var i = 0; i < orderList.length; i++) {
        //    productIdArr.push(orderList()[i].id());
        //}
        var productIdArr = ['PC0D3B4932D55B4', 'PC2986F10A7F624', 'PC622AD417B3AF4'];
        OrderServices.fetchOrderProduct(productIdArr).done(function (productDtos: Array<ProductDto>) {
            if (productDtos != null) {
                $.each(productDtos, function (idx: number, productDto: ProductDto) {
                    var product = new Product(productDto);
                    self.add(product);
                });
            }
        })
    }
    remove(orderLine: OrderLine) {
        this.orderLine.remove(orderLine);
        this.cookie().remove(orderLine.product().id());
    }
    add(product: Product) {
        for (var i = 0; i < this.orderLine.length; i++) {
            if (this.orderLine()[i].product().id() == product.id()) {
                this.orderLine()[i].increase();
            } else {
                var orderLine = new OrderLine(product);
                this.orderLine().push(orderLine);
            }
            this.cookie().add(product.id());
        }
    }
}
class OrderLine {
    productCount: KnockoutObservable<number>;
    linePrice: KnockoutObservable<number>;
    product: KnockoutObservable<Product>;
    constructor(product: Product) {
        var self = this;
        self.productCount = ko.observable(1);
        self.product = ko.observable(product);
        self.linePrice = ko.computed(function () {
            return product.price() * self.productCount();
        })
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
class AroundFarm {
    title: KnockoutObservable<string>;
    collections: KnockoutObservableArray<ATag>;
    banner: KnockoutObservableArray<Banner>;
    constructor() {
        var self = this;
        self.title = ko.observable("Chapi Farm - Nông Trại Ba Vì");
        self.collections = ko.observableArray([]);
        self.banner = ko.observableArray([]);
        
    }
    init() {
        var self = this;
    }
}
class Showroom {
    title: KnockoutObservable<string>;
    banners: KnockoutObservableArray<Banner>;
    constructor() {
        var self = this;
        self.title = ko.observable("- Phạm Hùng");
        self.banners = ko.observableArray([]);
    }
}
class ATag {
    name: KnockoutObservable<String>;
    href: KnockoutObservable<String>;
    constructor() {
        var self = this;
        self.name = ko.observable("");
        self.href = ko.observable("");
    }
}