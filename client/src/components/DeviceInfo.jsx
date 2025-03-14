import React from "react";

const DeviceInfo = ({ info }) => {
    const renderDescription = (description) => {
        const formattedDescription = description.split('\n').map((item, index) => (
            <React.Fragment key={index}>
                {item}
                {index < description.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
        return formattedDescription;
    };

    return (
        <div className="flex flex-col text-base">
            {info.map(item => (
                <div key={item.id} className="my-5">
                    <h3 className='font-bold text-orange-600'>{item.title}</h3>
                    <div>{renderDescription(item.description)}</div>
                </div>
            ))}
        </div>
    );
};

export default DeviceInfo;
