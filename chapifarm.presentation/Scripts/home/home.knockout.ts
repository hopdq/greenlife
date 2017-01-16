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
        self.initProductsInCate();
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
        //CommonServices.fetchCategoryTree().done(function (categories: Array<CategoryDto>) {
        //    if (categories != null && categories.length > 0) {
        //        $.each(categories, function (idx: number, cate: CategoryDto) {
        //            var category = new ProductsInCategory();
        //            category.setCategory(cate);
        //            category.fetchProducts();
        //        });
        //    }
        //});
        var categories = [];
        for (var i = 0; i < 10; i++){
            var cate = new CategoryDto();
            cate.Id = i + "";
            cate.Icon = "https://hstatic.net/704/1000059704/1000177804/coffee.png?v=1259";
            cate.Name = "cate "+i;
            cate.Url = "google.com";
            cate.Children = [];
            for (var j = 0; j < categories.length; j++) {
                cate.Children.push(categories[j]);
            }
            categories.push(cate);
        }

        if (categories != null && categories.length > 0) {
            $.each(categories, function (idx: number, cate: CategoryDto) {
                var category = new ProductsInCategory();
                category.setCategory(cate);
                category.proceedShowParentCateProducts();
                self.productsInCategories.push(category);
            });
        }
        
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
        parentTab.category = this.category;
        self.tabs.push(parentTab);
        if (this.category().hasChild) {
            $.each(this.category().children(), function (idx: number, child: KnockoutObservable<Category>) {
                var tab = new Tabs();
                tab.category = child;
                self.tabs.push(tab);
            });
        }
    }
    proceedShowParentCateProducts(): void {
        this.tabs()[0].fetchProducts();
    }
}
class Tabs {
    category: KnockoutObservable<Category>;
    products: KnockoutObservableArray<Product>;
    constructor() {
        this.products = ko.observableArray([]);
    }
    fetchProducts(): void {
        var self = this;
        //HomeServices.getProductByCategory(self.category().id()).done(function (products: Array<ProductDto>) {
        //    if (products != null && products.length > 0) {
        //        $.each(products, function (idx: number, dto: ProductDto) {
        //            self.products.push(new Product(dto));
        //        });
        //    }
        //});
        var products = [];
        for (var i = 0; i < 10; i++) {
            var product = new ProductDto();
            product.ProductId = i + "";
            product.Name = "Product" + i;
            product.ImagePath = "https://product.hstatic.net/1000059704/product/kimchi_20su_20h_c3_a0o_bd097735ede14ca2a85a0e37e2d6d40f_medium.png";
            product.EndUserPrice = 69000;
            product.UrlSlug = "https://www.google.com.vn/?gfe_rd=cr&ei=Vth5WNi3MMzU8AeWz5i4CQ";
            if (i % 2 == 0) {
                product.New = true;
                product.Gift = false;
            } else {
                product.New = false;
                product.Gift = true;
            }
            products.push(product);
        }
        $.each(products, function (idx: number, dto: ProductDto) {
            self.products.push(new Product(dto));
        });
        //$('')
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
    //quantityPromotion: KnockoutObservable<string>;
    //isPercentPromotion: KnockoutObservable<boolean>;
    //showPromotionInfor: KnockoutObservable<boolean>;
    isNew: KnockoutObservable<boolean>;
    isGift: KnockoutObservable<boolean>;
    constructor(dto: ProductDto) {
        var self = this;
        self.id = ko.observable(dto.ProductId);
        self.name = ko.observable(dto.Name);
        self.imgPath = ko.observable(dto.ImagePath);
        self.priceString = ko.observable(Utilities.formatNumber(dto.EndUserPrice));
        self.price = ko.observable(Utilities.formatNumber(dto.EndUserPrice));
        self.url = ko.observable(Utilities.buildWebUrl(dto.UrlSlug));
        self.isNew = ko.observable(dto.New)
        self.isGift = ko.observable(dto.Gift);
    }
}