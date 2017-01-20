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
    constructor() {
        this.slider = ko.observableArray([]);
        this.featureProducts = ko.observableArray([]);
        this.productsInCategories = ko.observableArray([]);
    }
    init() {
        var self = this;
        self.initSlider();
        self.initFeatureProducts();
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
                    category.fetchProducts();
                });
            }
        });
    }
}
class ProductsInCategory {
    category: KnockoutObservable<Category>;
    products: KnockoutObservableArray<Product>;
    constructor() {
        this.category = ko.observable(null);
        this.products = ko.observableArray([]);
    }
    setCategory(category: CategoryDto): void {
        this.category = ko.observable(new Category(category));
    }
    fetchProducts(): void {
        var self = this;
        HomeServices.getProductByCategory(self.category().id()).done(function (products: Array<ProductDto>) {
            if (products != null && products.length > 0) {
                $.each(products, function (idx: number, dto: ProductDto) {
                    self.products.push(new Product(dto));
                });
            }
        });
    }
}
class Product {
    id: KnockoutObservable<string>;
    name: KnockoutObservable<string>;
    imgPath: KnockoutObservable<string>;
    price: KnockoutObservable<string>;
    promotion: KnockoutObservable<string>;
    url: KnockoutObservable<string>;
    //quantityPromotion: KnockoutObservable<string>;
    //isPercentPromotion: KnockoutObservable<boolean>;
    //showPromotionInfor: KnockoutObservable<boolean>;
    isNew: KnockoutObservable<boolean>;
    isGift: KnockoutObservable<boolean>;
    constructor(dto: ProductDto) {
        var self = this;
        self.id = ko.observable(dto.ProductId);
        self.name = ko.observable(dto.Name);
        self.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImagePath));
        self.price = ko.observable(Utilities.formatNumber(dto.EndUserPrice));
        self.url = ko.observable(Utilities.buildWebUrl(dto.UrlSlug));
        self.isNew = ko.observable(dto.New)
        self.isGift = ko.observable(dto.Gift);
    }
}