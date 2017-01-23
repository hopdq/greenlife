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
        self.initProductsInCate();
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
                    category.proceedShowParentCateProducts();
                    self.productsInCategories.push(category);
                });
            }
        });
    };
    return HomeBodyModel;
}());
var ProductsInCategory = (function () {
    function ProductsInCategory() {
        this.category = ko.observable(null);
        this.tabs = ko.observableArray([]);
    }
    ProductsInCategory.prototype.setCategory = function (category) {
        var self = this;
        this.category = ko.observable(new Category(category));
        var parentTab = new Tabs();
        var curCate = $.extend(true, category, {});
        curCate.Name = "Tất cả";
        parentTab.category = new Category(curCate);
        self.tabs.push(parentTab);
        if (this.category().hasChild) {
            $.each(this.category().children(), function (idx, child) {
                var tab = new Tabs();
                tab.category = child;
                self.tabs.push(tab);
            });
        }
    };
    ProductsInCategory.prototype.proceedShowParentCateProducts = function () {
        var self = this.tabs()[0];
        self.fetchProducts().done(function (result) {
            self.displayMode("block");
        });
    };
    ProductsInCategory.prototype.switchTab = function (data, event) {
        var self = this;
        data.fetchProducts().done(function (result) {
            for (var i = 0; i < self.tabs().length; i++) {
                if (self.tabs()[i].category.id != data.category.id && self.tabs()[i].displayMode() == "block") {
                    self.tabs()[i].displayMode("none");
                }
            }
            data.displayMode("block");
        });
    };
    return ProductsInCategory;
}());
var Tabs = (function () {
    function Tabs() {
        this.products = ko.observableArray([]);
        this.displayMode = ko.observable("none");
    }
    Tabs.prototype.fetchProducts = function () {
        var dfd = $.Deferred();
        if (this.products().length <= 0) {
            var self = this;
            HomeServices.getProductByCategory(self.category.id(), DateGetInfoEnum.HomeProductGetNumber).done(function (products) {
                if (products != null && products.length > 0) {
                    $.each(products, function (idx, dto) {
                        self.products.push(new Product(dto));
                    });
                    dfd.resolve(true);
                }
            });
        }
        else {
            dfd.resolve(true);
        }
        return dfd.promise();
    };
    return Tabs;
}());
var Product = (function () {
    function Product(dto) {
        var self = this;
        self.id = ko.observable(dto.ProductId);
        self.name = ko.observable(dto.Name);
        self.imgPath = ko.observable(Utilities.buildImgUrl(dto.ImagePath));
        self.price = ko.observable(dto.PromotionPrice);
        self.priceString = ko.observable(Utilities.formatNumber(dto.PromotionPrice));
        self.url = ko.observable(Utilities.buildWebUrl(dto.UrlSlug));
        self.isNew = ko.observable(dto.IsNew);
        self.isGift = ko.observable(dto.IsGift);
    }
    return Product;
}());
