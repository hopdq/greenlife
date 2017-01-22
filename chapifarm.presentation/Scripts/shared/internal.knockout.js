var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Cookie = (function () {
    function Cookie() {
    }
    Cookie.prototype.setCookie = function (key, value, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = key + "=" + value + ";" + expires + ";path=/";
    };
    Cookie.prototype.getCookie = function (key) {
        var name = key + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    Cookie.prototype.checkCookie = function (key) {
        var username = this.getCookie(key);
        if (username != "") {
            return true;
        }
        else {
            return false;
        }
    };
    return Cookie;
}());
var CartCookie = (function (_super) {
    __extends(CartCookie, _super);
    function CartCookie() {
        _super.call(this);
        var self = this;
        self.key = "Cart";
        self.values = ko.observableArray([]);
        self.isExist = ko.computed(function () {
            return self.checkCookie(self.key);
        });
        if (!this.isExist)
            this.setCookie(this.key, JSON.stringify(this.values()), 30);
    }
    CartCookie.prototype.fetch = function () {
        var self = this;
        var cookieStr = self.getCookie(self.key);
        if (!self.isExist)
            return null;
        var arrayStr = new Array();
        arrayStr = JSON.parse(self.getCookie(self.key));
        arrayStr.forEach(function (value, idx) {
            var orderProduct = new Order.Product(value.id, value.countProduct);
            self.values.push(orderProduct);
        });
        return self.values;
    };
    CartCookie.prototype.add = function (productId) {
        var products = this.fetch();
        if (products != null) {
            var idx = this.getIndexProductById(productId, products);
            if (idx < 0)
                this.setNew(productId, products);
            else
                this.increase(idx, products);
        }
    };
    CartCookie.prototype.remove = function (productId) {
        var products = this.fetch();
        if (products != null) {
            var idx = this.getIndexProductById(productId, products);
            if (idx < 0)
                delete products[idx];
        }
        this.setCookie(this.key, JSON.stringify(products), 30);
    };
    CartCookie.prototype.setNew = function (productId, products) {
        var product = new Order.Product(productId, 1);
        products.push(product);
        this.setCookie(this.key, JSON.stringify(products), 30);
    };
    CartCookie.prototype.increase = function (idx, products) {
        products()[idx] = new Order.Product(products()[idx].id(), (products()[idx].countProduct() + 1));
        this.setCookie(this.key, JSON.stringify(products), 30);
    };
    CartCookie.prototype.getIndexProductById = function (productId, products) {
        var idx = -1;
        for (var i = 0; i < products.length; i++) {
            if (productId == products()[i].id())
                idx = i;
        }
        return idx;
    };
    return CartCookie;
}(Cookie));
