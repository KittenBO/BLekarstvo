import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Context } from '../main';
import { DeviceItem } from './DeviceItem';

export const DeviceList= observer(() => {

    const { device } = useContext(Context);

    return ( 
        <>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {device.devices.map(device => 
                <DeviceItem key={device.id} device={device} />
            )}
        </div>
        </>
     );
})
