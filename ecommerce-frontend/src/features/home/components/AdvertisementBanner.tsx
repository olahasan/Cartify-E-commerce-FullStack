interface AdvertisementBannerProps {
  pic: string;
  alt?: string;
}
const AdvertisementBanner = ({
  pic,
  alt = "Home Advertisement",
}: AdvertisementBannerProps) => {
  return <img src={pic} alt={alt} width="100%" height="100%" />;
};

export default AdvertisementBanner;
