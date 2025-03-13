import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Context } from '../main';

export const TypeBar = observer(() => {
  const { device } = useContext(Context);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTypeClick = (type) => {
    if (device.selectedType && device.selectedType.id === type.id) {
      device.setSelectedType([]);
    } else {
      device.setSelectedType(type);
    }
  };

  const filteredTypes = device.types.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTypes = device.types.slice().sort((a, b) => a.id - b.id).slice(0, 5);

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <h1 className="text-center sm:text-left text-xl font-serif font-semibold text-gray-700">Чем болеете?</h1>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Поиск по недугам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex w-2/3 sm:w-full p-2 mx-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {filteredTypes.length > 0 && searchQuery && (
        <div className="flex flex-wrap gap-4 justify-center 2xl:justify-start">
          {filteredTypes.map((type) => {
            const isSelected = device.selectedType && device.selectedType.id === type.id;

            return (
              <div
                className={`py-1.5 px-3 my-5 rounded-xl shadow-md text-center cursor-pointer ${
                  isSelected ? 'bg-amber-200' : 'bg-amber-50 text-gray-500'
                }`}
                key={type.id}
                onClick={() => handleTypeClick(type)}
              >
                {type.name}
              </div>
            );
          })}
        </div>
      )}

      {!searchQuery && (
        <>
          <p className="text-gray-500 text-center mt-5">Популярные запросы</p>
          <div className="flex flex-wrap justify-center gap-4 2xl:block">
            {popularTypes.map((type) => {
              const isSelected = device.selectedType && device.selectedType.id === type.id;

              return (
                <div
                  className={`py-1.5 px-3 my-5 rounded-xl shadow-md text-center cursor-pointer ${
                    isSelected ? 'bg-amber-200' : 'bg-amber-50 text-gray-500'
                  }`}
                  key={type.id}
                  onClick={() => handleTypeClick(type)}
                >
                  {type.name}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});