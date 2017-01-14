class Utilities {
    static buildApiUrl(url: string): string {
        return BaseModel.baseApiUrl + url;
    }
    static buildWebUrl(url: string): string {
        return BaseModel.baseWebUrl + url;
    }
    static buildImgUrl(url: string): string {
        return BaseModel.baseImgUrl + url;
    }
    static formatNumber(num: number, c: number = 0): string {
        return num.toFixed(c).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
}