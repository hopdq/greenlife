$(function () {
    var bodyModel = new HomeBodyModel();
    var viewModel = new Layout(bodyModel);
    ko.applyBindings(viewModel);
    viewModel.init();
});
var HomeBodyModel = (function () {
    function HomeBodyModel() {
        this.slider = ko.observableArray([]);
        this.featureProducts = ko.observableArray([]);
        this.productsInCategories = ko.observableArray([]);
    }
    HomeBodyModel.prototype.init = function () {
        var self = this;
        self.initSlider();
        self.initFeatureProducts();
    };
    HomeBodyModel.prototype.initSlider = function () {
        var self = this;
        CommonServices.fetchBannerByPositionPage(BannerPageEnum.Home, BannerPosEnum.Top)
            .done(function (banners) {
            if (banners != null && banners.length > 0) {
                $.each(banners, function (idx, banner) {
                    self.slider.push(new Banner(banner));
                });
            }
            $('#slider_flag').trigger('change');
        });
    };
    HomeBodyModel.prototype.initFeatureProducts = function () {
        var self = this;
        CommonServices.fetchBannerByPositionPage(BannerPageEnum.Home, BannerPosEnum.Body)
            .done(function (banners) {
            var max = 5;
            if (banners != null && banners.length > 0) {
                $.each(banners, function (idx, banner) {
                    if (idx > max) {
                        return;
                    }
                    self.featureProducts.push(new Banner(banner));
                });
            }
        });
    };
    HomeBodyModel.prototype.initProductsInCate = function () {
        var self = this;
        CommonServices.fetchCategoryTree().done(function (categories) {
            if (categories != null && categories.length > 0) {
                $.each(categories, function (idx, cate) {
                    var category = new ProductsInCategory();
                    category.setCategory(cate);
                    category.fetchProducts();
                });
            }
        });
    };
    return HomeBodyModel;
})();
var ProductsInCategory = (function () {
    function ProductsInCategory() {
        this.category = ko.observable(null);
        this.products = ko.observableArray([]);
    }
    ProductsInCategory.prototype.setCategory = function (category) {
        this.category = ko.observable(new Category(category));
    };
    ProductsInCategory.prototype.fetchProducts = function () {
        var self = this;
        HomeServices.getProductByCategory(self.category().id()).done(function (products) {
            if (products != null && products.length > 0) {
                $.each(products, function (idx, dto) {
                    self.products.push(new Product(dto));
                });
            }
        });
    };
    return ProductsInCategory;
})();
var Product = (function () {
    function Product(dto) {
        var self = this;
        self.id = ko.observable(dto.ProductId);
        self.name = ko.observable(dto.Name);
        self.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImagePath));
        self.price = ko.observable(Utilities.formatNumber(dto.EndUserPrice));
        self.url = ko.observable(Utilities.buildWebUrl(dto.UrlSlug));
        self.isNew = ko.observable(dto.New);
        self.isGift = ko.observable(dto.Gift);
    }
    return Product;
})();
//# sourceMappingURL=home.knockout.js.map