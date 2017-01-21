class Cookie {
    constructor() {
    }
    setCookie(key: string, value: string, exdays: number) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = key + "=" + value + ";" + expires + ";path=/";
    }
    getCookie(key: string): string{
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
    }
    checkCookie(key: string): boolean {
        var username = this.getCookie(key);
        if (username != "") {
            return true;
        } else {
            return false;
        }
    }
}
class CartCookie extends Cookie {
    key: string;
    isExist: KnockoutObservable<boolean>;
    values: KnockoutObservableArray<Order.Product>;
    constructor() {
        super();
        var self = this;
        self.key = "Cart";
        self.values = ko.observableArray([]);
        self.isExist = ko.computed(function () {
            return self.checkCookie(self.key);
        });
        if (!this.isExist)
            this.setCookie(this.key, JSON.stringify(this.values()), 30);
    }
    fetch(): KnockoutObservableArray<Order.Product>{
        var self = this;
        var cookieStr = self.getCookie(self.key);
        if (!self.isExist)
            return null;
        var arrayStr = new Array();
        arrayStr = JSON.parse(self.getCookie(self.key));
        arrayStr.forEach(function (value, idx) {
            var orderProduct = new Order.Product(value.id, value.countProduct);
            self.values.push(orderProduct);
        })
        return self.values;
    }
    add(productId: string) {
        var products = this.fetch();
        if (products != null) {
            var idx = this.getIndexProductById(productId, products);
            if (idx < 0)
                this.setNew(productId, products);
            else
                this.increase(idx, products);
        }
    }
    remove(productId: string) {
        var products = this.fetch();
        if (products != null) {
            var idx = this.getIndexProductById(productId, products);
            if (idx < 0)
                delete products[idx];
        }
        this.setCookie(this.key, JSON.stringify(products), 30);
    }
    setNew(productId: string, products: KnockoutObservableArray<Order.Product>) {
        var product = new Order.Product(productId, 1);
        products.push(product);
        this.setCookie(this.key, JSON.stringify(products), 30);
    }
    increase(idx: number, products: KnockoutObservableArray<Order.Product>) {
        products()[idx] = new Order.Product(products()[idx].id(), (products()[idx].countProduct() + 1));
        this.setCookie(this.key, JSON.stringify(products), 30);
    }
    getIndexProductById(productId: string, products: KnockoutObservableArray<Order.Product>): number {
        var idx = -1;
        for (var i = 0; i < products.length; i++) {
            if (productId == products()[i].id())
                idx= i;
        }
        return idx;
    }
}