class CategoryDto {
    Id: string;
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
    public CategoryId: string;
    public ProviderId: string;
    public ProductId: string;
    public Barcode: string;
    public Name: string;
    public Summary: string;
    public Description: string
    public ImagePath: string
    public Promotion: string
    public EndUserPrice: number
    public Quantity: number
    public QuantityStatus: string
    public NameUnsign: string
    public Keyword: string
    public MetaTitle: string
    public MetaDesc: string
    public View: number
    public Gift: boolean
    public New: boolean
    public QuantityPromotion: number
    public StartPromotion: Date
    public CategoryName: string
    public TinhThanhID: number
    public customise1: string
    public customise2: string
    public customise3: string
    public DecreasePrice: number
    public UrlSlug: string
    public customise4: string
    public customise5: string
    public customise6: string
}