class BaseModel {
    //static baseApiUrl: string = 'http://services.chapifarm.com/';
    static baseApiUrl: string = 'http://localhost:8096/';
    static baseWebUrl: string = 'http://localhost:8090/';
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
    constructor() {
        var self = this;
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
