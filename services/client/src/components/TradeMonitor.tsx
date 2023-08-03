import React from 'react';
import { TextField } from '@material-ui/core';

export const TradeMonitor = () => {
  return (
    <div>
      <h2 style={{ lineHeight: '45px' }}>
        Dashboard
        <span>
          <TextField id="new-category" label="Create new category" variant="outlined" />
        </span>
      </h2>
    </div>
  );
};
