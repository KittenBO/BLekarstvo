import { TypeBar } from "../components/TypeBar";
import { BrandBar } from "../components/BrandBar";
import { DeviceList } from "../components/DeviceList";
import Pages from "../components/Pages";
import { observer } from "mobx-react-lite";
import { useContext, useEffect } from "react";
import { Context } from "../main";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";



const Shop = observer(() => {
    const { device } = useContext(Context);

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchBrands().then(data => device.setBrands(data))
        fetchDevices(null, null, 1, null).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [])

    useEffect(() => {
        fetchDevices(device.selectedType.id, device.selectedBrand.id, device.page, device.limit).then(data => {
            device.setDevices(data.rows)
            device.setTotalCount(data.count)
        })
    }, [device.page, device.selectedType, device.selectedBrand, device.limit ])

    return (  
        <>
            <div className="flex flex-wrap container mx-auto">
                <TypeBar className="w-1/6" />
                <div className="w-5/6">
                    <BrandBar/>
                    <DeviceList/>
                    <Pages/>
                </div>
            </div>
        </>
    );
});


export default Shop;