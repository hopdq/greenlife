class CategoryDto {
    Id: string;
    Icon: string;
    Name: string;
    Url: string;
    Children: Array<CategoryDto>;
}

class BannerDto {
    Id: string;
    Text: string;
    ImgPath: string;
    Link: string;
}

class BannerPageEnum {
    static Home: string = "HomePage";
}

class BannerPosEnum {
    static Top: string = "Top";
    static Body: string = "";
}

class DateGetInfoEnum {
    static HomeProductGetNumber: number = 12;
}

class ProductDto {
    ProductId: string
    Name: string
    ImagePath: string
    IsNew: boolean
    HotProduct: number
    EndUserPrice: number
    QuantityStatus: string
    StartPromotion: number
    ExpireDate: Date
    DecreasePrice: number
    Promotion: string
    QuantityPromotion: number
    PromotionPrice: number
    IsGift: boolean
    RealDecreasePrice: number
    IsPromoting: boolean
    SlKhuyenMai: number
    UrlSlug: string
    customise1: string
    customise2: string
    customise3: string
    AverageStar: number
}