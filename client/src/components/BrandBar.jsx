import React from 'react';
import Slider from 'react-slick';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../main';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="my-10">
            <h1 className='text-xl font-serif font-semibold text-gray-700 text-center'>Бренды, которым мы доверяем</h1>
            <Slider {...settings}>
                {brands.map(brand => (
                    <div key={brand.id} 
                        className="flex items-center justify-center mx-2"
                        onClick={() => handleBrandClick(brand)}
                    >
                        <div className="shadow-md text-center w-[150px] h-[75px]">
                            <img 
                                src={import.meta.env.VITE_STATIC_API_URL + brand.img} 
                                alt={brand.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ))}
            </Slider>
            {device.selectedBrand.name && !device.selectedType.name &&
                <h1 className='font-serif text-gray-700'>Показаны товары только от бренда: {device.selectedBrand.name}</h1>
            }
            {device.selectedType.name && !device.selectedBrand.name &&
                <h1 className='font-serif text-gray-700'>Показаны товары только от: {device.selectedType.name}</h1>
            }
            {device.selectedType.name && device.selectedBrand.name &&
                <h1 className='font-serif text-gray-700'>Показаны товары только от: {device.selectedType.name} и бренда: {device.selectedBrand.name}</h1>
            }
        </div>
    );
});

