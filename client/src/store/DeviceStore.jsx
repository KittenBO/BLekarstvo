import { makeAutoObservable } from "mobx";

export default class DeviceStore {
    constructor() {
        this._types = [
            { id: 1, name: "Таблетки" },
            { id: 2, name: "Мази" },
            { id: 3, name: "Шампуни" },
            { id: 4, name: "Крема" },
        ]
        this._brands = [
            { id: 1, name: "ЗОЛОТАЯ ЗВЕЗДА" },
            { id: 2, name: "ВИТАНИУМ" },
            { id: 3, name: "ЭКСПЕРТ ВОЛОС" },
        ]
        this._devices = [
            { id: 2, name: "Парацетомол", price: 386, rating: 4, img: 'https://612611.selcdn.ru/prod-s3/iblock/3f4/3f4677246e1aaccc08b1cf506441aa05.jpg' },
            { id: 3, name: "Бальзам ЗОЛОТАЯ ЗВЕЗДА", price: 617, rating: 5, img: 'https://avatars.mds.yandex.net/get-mpic/5220759/img_id120583545777693.jpeg/orig' },
            { id: 4, name: "Магний в 6 форте витаниум 30 шт. таблетки массой 1170 мг", price: 308, rating: 5, img: 'https://cdn.eapteka.ru/upload/offer_photo/492/604/3_24ee3c96dd1ad12591aa1031bc666e4e.png?t=1714217470&_cvc=1728460462' },
        ]
        makeAutoObservable(this);
    }

    setTypes(types) {
        this._types = types;
    }

    setBrands(brands) {
        this._brands = brands;
    }
    setDevices(devices) {
        this._devices = devices;
    }

    get types() {
        return this._types;
    }
    get brands() {
        return this._brands;
    }
    get devices() {
        return this._devices;
    }
}