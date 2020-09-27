import React from 'react';

interface TradingOption {
  value: string;
  selected: string;
  text?: string;
}

export const TradingOption = ({ value, selected, text }: TradingOption) => {
  return (
    <option value={value} selected={value === selected}>{text || value}</option>
  );
};

