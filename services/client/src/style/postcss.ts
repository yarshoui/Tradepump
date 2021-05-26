import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const tile = {
  margin: '10px 25px',
};

export const autocomplete = { width: 233, margin: '10px 0', fontStyle: 'italic' };

export const btn = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 30,
  padding: '0 30px',
  margin: '5px 0',
};

export const themeStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      float: 'right',

      '& > *': {
        margin: theme.spacing(1),
        width: '15ch',
        height: '10px',
        marginTop: '-7px',
      },
    },
  }),
);
