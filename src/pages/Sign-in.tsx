import React, { useEffect }  from 'react';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
// import { RadioButtonCheckedTwoTone } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import { url } from 'inspector';
import { Form, Field } from 'react-final-form';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import {
  Typography,
  Paper,
  Link,
  Grid,
  Button,
  // CssBaseline,
  // RadioGroup,
  // FormLabel,
  // MenuItem,
  // FormGroup,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
// Picker
// import DateFnsUtils from '@date-io/date-fns';
import {
  // MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
} from '@material-ui/pickers';

const onSubmit = async (values:any) => {
  const sleep = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(300);
  window.alert(JSON.stringify(values));
};

const validate = (values:any) => {
  const errors:any = {};
 
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.username) {
    errors.username = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  return errors;
};

ReactGA.initialize('UA-184831310-1');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    width:'50%',
    overflowX: 'auto',
    fontFamily: 'sans-serif',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 400,
    marginLeft: '10px',
  },

  margin: {
    margin: theme.spacing(1),
  },

  textField: {
    width: '30ch',
    
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  contentHolder: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tableHolder: {
    flexGrow: 1,
  },
  asideHolder: {
    width: '180px',
    paddingLeft: '20px',
  },
  topHolder: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  logoHolder: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  asideTopHolder: {
    paddingLeft: '20px',
  },
  aboutPageLinks:{
    textDecoration: 'none',
    color: 'blue',
  },
  tfaLockIcon:{
    backgroundSize: 'cover',
    // backgroundImage: url(),
    width: '4.5rem',
    height: '6rem',
  },

}));
interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

export const SignIn = () => {
  const classes = useStyles();

  const [values, setValues] = React.useState<State>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  useEffect( () => {
    // GoogleAnalytics
    ReactGA.pageview(window.location.pathname + window.location.search); 
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

  return (
    <div className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />          
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="TradePump" />
        <meta name="description" content="Tradepump is not just a Bitcoin and Cryptocurrency Free Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta name="generator" content="ReactJS"></meta>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="style.css" />
        <title>Bitcoin & Cryptocurrency Free Aggregator | TradePump.com | Login to your account</title>
        <meta property="og:title" content="Bitcoin & Cryptocurrency Aggregator | TradePump.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tradepump.com/sign-in" />
        <meta property="og:image" content="https://www.tradepump.com/android-chrome-192x192.png" />
        <meta property="og:description" content="Tradepump is not just a Bitcoin and Cryptocurrency Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
      </Helmet>


      <Form
        onSubmit={onSubmit}
        initialValues={{ agreement: false }}
        validate={validate}
        render={({ handleSubmit, values /*, reset, submitting, pristine, values */}) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                Secure Sign-In
              </Typography> 
                </Grid>
              
                <Grid item xs={12}>
                  <Field
                    fullWidth
                    required
                    name="username"
                    component={TextField}
                    type="text"
                    label="Username"
                  />
                </Grid>

                <Grid item xs={12}>
                <FormControl className={clsx(classes.margin, classes.textField)}>
          <InputLabel htmlFor="standard-adornment-password">Password *</InputLabel>
          <Input
            id="standard-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
                </Grid>
                
                <Grid item style={{ marginTop: 16 }}>
                  <Button 
                  variant="contained" 
                  color="primary" 
                  disableElevation 
                  disabled> 
                  {/* Enabled if 
                  1. All fields are filled in 
                  2. There is no such a Username in the DB*/}
                    Sign In
                  </Button>
                </Grid>

                <Grid item xs={12}>
                <Link href="#" onClick={preventDefault}>Trouble signing in?</Link>
                </Grid>
              </Grid>
            </Paper>
            {/* <pre>{JSON.stringify(values)}</pre> */}
          </form>
        )}
      />

      <Form
        onSubmit={onSubmit}
        initialValues={{ agreement: false }}
        validate={validate}
        render={({ handleSubmit, values /*, reset, submitting, pristine, values */}) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                Enter the email address and username associated with your TradePump account to receive an email with password reset instructions.
              </Typography> 
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    fullWidth
                    required
                    component={TextField}
                    type="email"
                    label="Email"
                  />
                </Grid>
              
                <Grid item xs={12}>
                  <Field
                    fullWidth
                    required
                    name="username"
                    component={TextField}
                    type="text"
                    label="Username"
                  />
                </Grid>

                               
                <Grid item style={{ marginTop: 16 }}>
                  <Button 
                  variant="contained" 
                  color="primary" 
                  disableElevation 
                  disabled> 
                  {/* Enabled if 
                  1. All fields are filled in 
                  2. There is no such a Username or email in the DB
                  3. If username and email do not match}*/}
                    Recover password
                  </Button>
                </Grid>

                <Grid item xs={12}>
                <Link href="#" onClick={preventDefault}>Forgot username?</Link>
                </Grid>
              </Grid>
            </Paper>
            {/* <pre>{JSON.stringify(values)}</pre> */}
          </form>
        )}
      />
      <Form
        onSubmit={onSubmit}
        initialValues={{ agreement: false }}
        validate={validate}
        render={({ handleSubmit, values /*, reset, submitting, pristine, values */}) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                Enter the email address and username associated with your TradePump account to receive an email with your username.
              </Typography> 
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="email"
                    fullWidth
                    required
                    component={TextField}
                    type="email"
                    label="Email"
                  />
                </Grid>
              
                                               
                <Grid item style={{ marginTop: 16 }}>
                  <Button 
                  variant="contained" 
                  color="primary" 
                  disableElevation 
                  disabled> 
                  {/* Enabled if 
                  1. All fields are filled in 
                  2. There is no such a Username or email in the DB
                  3. If username and email do not match}*/}
                    Recover username
                  </Button>
                </Grid>

                <Grid item xs={12}><span>Forgot email? </span>
                <a href="mailto:support@tradepump.com" >Contact support</a>
                </Grid>
              </Grid>
            </Paper>
            {/* <pre>{JSON.stringify(values)}</pre> */}
          </form>
        )}
      />
 
    </div>
  );
};
