var Utilities = (function () {
    function Utilities() {
    }
    Utilities.buildApiUrl = function (url) {
        return BaseModel.baseApiUrl + url;
    };
    Utilities.buildWebUrl = function (url) {
        return BaseModel.baseWebUrl + url;
    };
    Utilities.buildImgUrl = function (url) {
        return BaseModel.baseImgUrl + url;
    };
    Utilities.formatNumber = function (num, c) {
        if (c === void 0) { c = 0; }
        return num.toFixed(c).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    };
    return Utilities;
})();
//# sourceMappingURL=ultilities.js.map