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
        for (var i = 0; i < 10; i++) {
            var cate = new CategoryDto();
            cate.Id = i + "";
            cate.Icon = "https://hstatic.net/704/1000059704/1000177804/coffee.png?v=1259";
            cate.Name = "cate " + i;
            cate.Url = "google.com";
            cate.Children = [];
            for (var j = 0; j < categories.length; j++) {
                cate.Children.push(categories[j]);
            }
            categories.push(cate);
        }
        if (categories != null && categories.length > 0) {
            $.each(categories, function (idx, cate) {
                var category = new ProductsInCategory();
                category.setCategory(cate);
                category.proceedShowParentCateProducts();
                self.productsInCategories.push(category);
            });
        }
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
        parentTab.category = this.category;
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
        this.tabs()[0].fetchProducts();
    };
    return ProductsInCategory;
}());
var Tabs = (function () {
    function Tabs() {
        this.products = ko.observableArray([]);
    }
    Tabs.prototype.fetchProducts = function () {
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
            }
            else {
                product.New = false;
                product.Gift = true;
            }
            products.push(product);
        }
        $.each(products, function (idx, dto) {
            self.products.push(new Product(dto));
        });
        //$('')
    };
    return Tabs;
}());
var Product = (function () {
    function Product(dto) {
        var self = this;
        self.id = ko.observable(dto.ProductId);
        self.name = ko.observable(dto.Name);
        self.imgPath = ko.observable(dto.ImagePath);
<<<<<<< HEAD
        self.priceString = ko.observable(Utilities.formatNumber(dto.EndUserPrice));
=======
        self.price = ko.observable(Utilities.formatNumber(dto.EndUserPrice));
>>>>>>> working with tab
        self.url = ko.observable(Utilities.buildWebUrl(dto.UrlSlug));
        self.isNew = ko.observable(dto.New);
        self.isGift = ko.observable(dto.Gift);
    }
    return Product;
}());
