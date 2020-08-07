import * as React from 'react';
import { ChangeEvent, useState } from 'react';
import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { themeStyles } from '../style/postcss';

export const krakenOrderMonitor = () => {
  return (
    <div>
      <h2 style={{ lineHeight: '45px' }}>
        Dashboard
        <span>
          <TextField
            id="new-category"
            label="Create new category"
            variant="outlined"
          />
        </span>
      </h2>
    </div>
  );
};
