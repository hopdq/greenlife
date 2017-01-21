$(function () {
    var bodyModel = new HomeBodyModel();
    var viewModel = new Layout<HomeBodyModel>(bodyModel);
    ko.applyBindings(viewModel);
    viewModel.init();
});
class HomeBodyModel implements BaseBody {
    slider: KnockoutObservableArray<Banner>;
    featureProducts: KnockoutObservableArray<Banner>;
    productsInCategories: KnockoutObservableArray<ProductsInCategory>;
    chapiAround: KnockoutObservable<ChapiAround>;
    constructor() {
        this.slider = ko.observableArray([]);
        this.featureProducts = ko.observableArray([]);
        this.productsInCategories = ko.observableArray([]);
    }
    init() {
        var self = this;
        self.initSlider();
        self.initFeatureProducts();
        self.initProductsInCate();
        self.initChapiAround();
    }
    initSlider() {
        var self = this;
        CommonServices.fetchBannerByPositionPage(BannerPageEnum.Home, BannerPosEnum.Top)
            .done(function (banners: Array<BannerDto>) {
                if (banners != null && banners.length > 0) {
                    $.each(banners, function (idx: number, banner: BannerDto) {
                        self.slider.push(new Banner(banner));
                    });
                }
                $('#slider_flag').trigger('change');
            });
    }
    initFeatureProducts() {
        var self = this;
        CommonServices.fetchBannerByPositionPage(BannerPageEnum.Home, BannerPosEnum.Body)
            .done(function (banners: Array<BannerDto>) {
                var max = 5;
                if (banners != null && banners.length > 0) {
                    $.each(banners, function (idx: number, banner: BannerDto) {
                        if (idx > max) {
                            return;
                        }
                        self.featureProducts.push(new Banner(banner));
                    });
                }
            });
    }
    initProductsInCate() {
        var self = this;
        CommonServices.fetchCategoryTree().done(function (categories: Array<CategoryDto>) {
            if (categories != null && categories.length > 0) {
                $.each(categories, function (idx: number, cate: CategoryDto) {
                    var category = new ProductsInCategory();
                    category.setCategory(cate);
                    category.proceedShowParentCateProducts();
                    self.productsInCategories.push(category);
                });
            }
        });
    }
    initChapiAround() {
        var self = this;
        var cpa = new ChapiAround();
        cpa.collections(['Nhà máy trà cổ', 'Đồi trà Cầu Đất Farm', 'Vườn rau thủy canh', 'Khu vườn sen đá']);
        var aroundArray = [];
        for (var i = 0; i < 10; i++){
            var around = new Around();
            around.url("https://caudatfarm.com/collections/hinh-anh-nong-trai");
            if (i % 2 == 0) {
                around.imgLink("https://hstatic.net/704/1000059704/1000208939/tab_footer_1_img_4.jpg?v=426");
            } else {
                around.imgLink("https://hstatic.net/704/1000059704/1000208939/tab_footer_1_img_3.jpg?v=426");
            }
            aroundArray.push(around);
        }
        cpa.around(aroundArray);
    }
}
class ProductsInCategory {
    category: KnockoutObservable<Category>;
    tabs: KnockoutObservableArray<Tabs>;
    constructor() {
        this.category = ko.observable(null);
        this.tabs = ko.observableArray([]);
    }
    setCategory(category: CategoryDto): void {
        var self = this;
        this.category = ko.observable(new Category(category));
        var parentTab = new Tabs();
        var curCate = $.extend(true, category, {});
        curCate.Name = "Tất cả";
        parentTab.category = new Category(curCate);
        self.tabs.push(parentTab);
        if (this.category().hasChild) {
            $.each(this.category().children(), function (idx: number, child: Category) {
                var tab = new Tabs();
                tab.category = child;
                self.tabs.push(tab);
            });
        }
    }
    proceedShowParentCateProducts(): void {
        var self = this.tabs()[0];
        self.fetchProducts().done(function (result: boolean) {
            self.displayMode("block");
        });
    }
    switchTab(data: Tabs, event): void {
        var self = this;
        data.fetchProducts().done(function (result: boolean) {
            for (var i = 0; i < self.tabs().length; i++) {
                if (self.tabs()[i].category.id != data.category.id && self.tabs()[i].displayMode() == "block") {
                    self.tabs()[i].displayMode("none");
                }
            }
            data.displayMode("block");
        });
    }
}
class Tabs {
    category: Category;
    products: KnockoutObservableArray<Product>;
    displayMode: KnockoutObservable<string>;
    constructor() {
        this.products = ko.observableArray([]);
        this.displayMode = ko.observable("none");
    }
    fetchProducts(): JQueryPromise<boolean> {
        var dfd = $.Deferred();
        if (this.products().length <= 0) {
            var self = this;
            HomeServices.getProductByCategory(self.category.id(), DateGetInfoEnum.HomeProductGetNumber).done(function (products: Array<ProductDto>) {
                if (products != null && products.length > 0) {
                    $.each(products, function (idx: number, dto: ProductDto) {
                        self.products.push(new Product(dto));
                    });
                    dfd.resolve(true);
                }
            });
        } else {
            dfd.resolve(true);
        }
        return dfd.promise();
    }
}
class Product {
    id: KnockoutObservable<string>;
    name: KnockoutObservable<string>;
    imgPath: KnockoutObservable<string>;
    price: KnockoutObservable<number>;
    priceString: KnockoutObservable<string>;
    promotion: KnockoutObservable<string>;
    url: KnockoutObservable<string>;
    isNew: KnockoutObservable<boolean>;
    isGift: KnockoutObservable<boolean>;
    constructor(dto: ProductDto) {
        var self = this;
        self.id = ko.observable(dto.ProductId);
        self.name = ko.observable(dto.Name);
        self.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImagePath));
        self.price = ko.observable(dto.PromotionPrice);
        self.priceString = ko.observable(Utilities.formatNumber(dto.PromotionPrice));
        self.url = ko.observable(Utilities.buildWebUrl(dto.UrlSlug));
        self.isNew = ko.observable(dto.IsNew)
        self.isGift = ko.observable(dto.IsGift);
    }
}