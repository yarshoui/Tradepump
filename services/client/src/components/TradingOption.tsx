import React from 'react';

interface TradingOption {
  value: string;
  selected: string;
  text?: string;
}

export const TradingOption = ({ value, text }: TradingOption) => {
  return (
    <option value={value}>
      {text || value}
    </option>
  );
};
