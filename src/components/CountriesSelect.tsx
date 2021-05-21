import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import { CountriesStore } from 'src/logic/countriesStore';

interface Props {
  store: CountriesStore;
  className?: string;
  selectClassName?: string;
  country?: number;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

class CountriesSelectComp extends React.Component<Props> {
  renderCountries() {
    console.log(this.props.store.countries);
    if (!this.props.store.countries) {
      return <em>Loading...</em>;
    }

    return this.props.store.countries.map(country => (
      <MenuItem key={country.country_id} value={country.country_id}>{country.country_name}</MenuItem>
    ));
  }

  render() {
    return (
      <FormControl required className={this.props.className}>
        <InputLabel id="demo-simple-select-required-label">Country of residence</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={this.props.country}
          onChange={this.props.onChange}
          className={this.props.selectClassName}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {this.renderCountries()}
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    );
  }
}

export const CountriesSelect = observer(CountriesSelectComp);
