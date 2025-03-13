import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../main';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const CustomArrow = ({ onClick, icon: Icon, direction }) => (
  <div
    className={`absolute top-1/2 transform -translate-y-1/2 z-10 cursor-pointer ${
      direction === 'left' ? 'left-2' : 'right-2'
    }`}
    onClick={onClick}
  >
    <Icon className="text-2xl text-gray-700 hover:text-gray-900 bg-white rounded-full p-1 shadow-md" />
  </div>
);

export const BrandBar = observer(() => {
  const { device } = useContext(Context);
  const brands = device.brands;

  const handleBrandClick = (brand) => {
    if (device.selectedBrand && device.selectedBrand.id === brand.id) {
      device.setSelectedBrand([]);
    } else {
      device.setSelectedBrand(brand);
    }
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Количество видимых слайдов
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    prevArrow: <CustomArrow icon={FaArrowLeft} direction="left" />,
    nextArrow: <CustomArrow icon={FaArrowRight} direction="right" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="my-10 mx-4 sm:mx-10">
      <h1 className="text-xl font-serif font-semibold text-gray-700 text-center mb-5">
        Бренды, которым мы доверяем
      </h1>

      {/* Слайдер */}
      <div className="relative">
        <Slider {...settings}>
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center px-2"
              onClick={() => handleBrandClick(brand)}
            >
              <div className="shadow-md text-center rounded-lg overflow-hidden">
                <img
                  src={import.meta.env.VITE_STATIC_API_URL + brand.img}
                  alt={brand.name}
                  className="w-full h-[100px] object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Сообщения о выбранном бренде или типе */}
      {device.selectedBrand.name && !device.selectedType.name && (
        <h1 className="font-serif text-gray-700 text-center mt-5">
          Показаны товары только от бренда: {device.selectedBrand.name}
        </h1>
      )}
      {device.selectedType.name && !device.selectedBrand.name && (
        <h1 className="font-serif text-gray-700 text-center mt-5">
          Показаны товары только от: {device.selectedType.name}
        </h1>
      )}
      {device.selectedType.name && device.selectedBrand.name && (
        <h1 className="font-serif text-gray-700 text-center mt-5">
          Показаны товары только от: {device.selectedType.name} и бренда:{' '}
          {device.selectedBrand.name}
        </h1>
      )}
    </div>
  );
});