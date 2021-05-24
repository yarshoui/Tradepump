import { decorate, observable } from 'mobx';
import { fetchData } from 'src/utils/apiUtils';

export interface Country {
  country_id: number;
  country_name: string;
  country_iso: string;
  country_iso3: string;
  country_numcode: number;
  country_phonecode: number;
}

export const countryGuard = (model: any): model is Country => 
  model &&
  model.country_id > 0;

export class CountriesStore {
  initializing: boolean;
  countries?: Country[];

  constructor() {
    this.initializing = true;
    this.getCountries();
  }

  async getCountries() {
    const data = await fetchData<Country[]>('/api/v1/countries');

    this.initializing = false;
    if (Array.isArray(data)) {
      this.countries = data;
    }
  }
}

decorate(CountriesStore, {
  countries: observable,
  initializing: observable,
});

export const countriesStore = new CountriesStore();
