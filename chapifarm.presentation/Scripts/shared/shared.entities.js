var CategoryDto = (function () {
    function CategoryDto() {
    }
    return CategoryDto;
}());
var BannerDto = (function () {
    function BannerDto() {
    }
    return BannerDto;
}());
var BannerPageEnum = (function () {
    function BannerPageEnum() {
    }
    BannerPageEnum.Home = "HomePage";
    return BannerPageEnum;
}());
var BannerPosEnum = (function () {
    function BannerPosEnum() {
    }
    BannerPosEnum.Top = "Top";
    BannerPosEnum.Body = "";
    return BannerPosEnum;
}());
var DateGetInfoEnum = (function () {
    function DateGetInfoEnum() {
    }
    DateGetInfoEnum.HomeProductGetNumber = 12;
    return DateGetInfoEnum;
}());
var ProductDto = (function () {
    function ProductDto() {
    }
    return ProductDto;
}());
var ChapiAround = (function () {
    function ChapiAround() {
        var self = this;
        self.title = ko.observable("Chapi Farm - Nông Trại Trên Thảo Nguyên");
        self.collections = ko.observableArray([]);
        self.around = ko.observableArray([]);
    }
    return ChapiAround;
}());
var Around = (function () {
    function Around() {
        var self = this;
        self.url = ko.observable("");
        self.imgLink = ko.observable("");
    }
    return Around;
}());
