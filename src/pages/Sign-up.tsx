import React, { useEffect }  from 'react';
import 'src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
// import { isUndefined } from 'lodash';
import { Form, Field } from 'react-final-form';
import { Checkbox } from 'final-form-material-ui';
import TextField from '@material-ui/core/TextField';
// import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
// import FilledInput from '@material-ui/core/FilledInput';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Typography,
  Paper,
  // Link,
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

function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

function DatePickerWrapper(props:any) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;

  return (
    <DatePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  );
}

function TimePickerWrapper(props:any) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;

  return (
    <TimePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  );
}

const onSubmit = async (values:any) => {
  const sleep = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(300);
  window.alert(JSON.stringify(values));
};

const validate = (values:any) => {
  const errors:any = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  if (!values.username) {
    errors.username = 'Required';
  }
  return errors;
};



ReactGA.initialize('UA-184831310-1');

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  rootForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },

  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
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
  
}));
interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}
interface CountryType {
  code: string;
  label: string;
  phone: string;
}

const countries = [
  { code: 'AD', label: 'Andorra', phone: '376' },
  { code: 'AE', label: 'United Arab Emirates', phone: '971' },
  { code: 'AF', label: 'Afghanistan', phone: '93' },
  { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
  { code: 'AI', label: 'Anguilla', phone: '1-264' },
  { code: 'AL', label: 'Albania', phone: '355' },
  { code: 'AM', label: 'Armenia', phone: '374' },
  { code: 'AO', label: 'Angola', phone: '244' },
  { code: 'AQ', label: 'Antarctica', phone: '672' },
  { code: 'AR', label: 'Argentina', phone: '54' },
  { code: 'AS', label: 'American Samoa', phone: '1-684' },
  { code: 'AT', label: 'Austria', phone: '43' },
  { code: 'AU', label: 'Australia', phone: '61', suggested: true },
  { code: 'AW', label: 'Aruba', phone: '297' },
  { code: 'AX', label: 'Alland Islands', phone: '358' },
  { code: 'AZ', label: 'Azerbaijan', phone: '994' },
  { code: 'BA', label: 'Bosnia and Herzegovina', phone: '387' },
  { code: 'BB', label: 'Barbados', phone: '1-246' },
  { code: 'BD', label: 'Bangladesh', phone: '880' },
  { code: 'BE', label: 'Belgium', phone: '32' },
  { code: 'BF', label: 'Burkina Faso', phone: '226' },
  { code: 'BG', label: 'Bulgaria', phone: '359' },
  { code: 'BH', label: 'Bahrain', phone: '973' },
  { code: 'BI', label: 'Burundi', phone: '257' },
  { code: 'BJ', label: 'Benin', phone: '229' },
  { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
  { code: 'BM', label: 'Bermuda', phone: '1-441' },
  { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
  { code: 'BO', label: 'Bolivia', phone: '591' },
  { code: 'BR', label: 'Brazil', phone: '55' },
  { code: 'BS', label: 'Bahamas', phone: '1-242' },
  { code: 'BT', label: 'Bhutan', phone: '975' },
  { code: 'BV', label: 'Bouvet Island', phone: '47' },
  { code: 'BW', label: 'Botswana', phone: '267' },
  { code: 'BY', label: 'Belarus', phone: '375' },
  { code: 'BZ', label: 'Belize', phone: '501' },
  { code: 'CA', label: 'Canada', phone: '1', suggested: true },
  { code: 'CC', label: 'Cocos (Keeling) Islands', phone: '61' },
  { code: 'CD', label: 'Congo, Democratic Republic of the', phone: '243' },
  { code: 'CF', label: 'Central African Republic', phone: '236' },
  { code: 'CG', label: 'Congo, Republic of the', phone: '242' },
  { code: 'CH', label: 'Switzerland', phone: '41' },
  { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
  { code: 'CK', label: 'Cook Islands', phone: '682' },
  { code: 'CL', label: 'Chile', phone: '56' },
  { code: 'CM', label: 'Cameroon', phone: '237' },
  { code: 'CN', label: 'China', phone: '86' },
  { code: 'CO', label: 'Colombia', phone: '57' },
  { code: 'CR', label: 'Costa Rica', phone: '506' },
  { code: 'CU', label: 'Cuba', phone: '53' },
  { code: 'CV', label: 'Cape Verde', phone: '238' },
  { code: 'CW', label: 'Curacao', phone: '599' },
  { code: 'CX', label: 'Christmas Island', phone: '61' },
  { code: 'CY', label: 'Cyprus', phone: '357' },
  { code: 'CZ', label: 'Czech Republic', phone: '420' },
  { code: 'DE', label: 'Germany', phone: '49', suggested: true },
  { code: 'DJ', label: 'Djibouti', phone: '253' },
  { code: 'DK', label: 'Denmark', phone: '45' },
  { code: 'DM', label: 'Dominica', phone: '1-767' },
  { code: 'DO', label: 'Dominican Republic', phone: '1-809' },
  { code: 'DZ', label: 'Algeria', phone: '213' },
  { code: 'EC', label: 'Ecuador', phone: '593' },
  { code: 'EE', label: 'Estonia', phone: '372' },
  { code: 'EG', label: 'Egypt', phone: '20' },
  { code: 'EH', label: 'Western Sahara', phone: '212' },
  { code: 'ER', label: 'Eritrea', phone: '291' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'ET', label: 'Ethiopia', phone: '251' },
  { code: 'FI', label: 'Finland', phone: '358' },
  { code: 'FJ', label: 'Fiji', phone: '679' },
  { code: 'FK', label: 'Falkland Islands (Malvinas)', phone: '500' },
  { code: 'FM', label: 'Micronesia, Federated States of', phone: '691' },
  { code: 'FO', label: 'Faroe Islands', phone: '298' },
  { code: 'FR', label: 'France', phone: '33', suggested: true },
  { code: 'GA', label: 'Gabon', phone: '241' },
  { code: 'GB', label: 'United Kingdom', phone: '44' },
  { code: 'GD', label: 'Grenada', phone: '1-473' },
  { code: 'GE', label: 'Georgia', phone: '995' },
  { code: 'GF', label: 'French Guiana', phone: '594' },
  { code: 'GG', label: 'Guernsey', phone: '44' },
  { code: 'GH', label: 'Ghana', phone: '233' },
  { code: 'GI', label: 'Gibraltar', phone: '350' },
  { code: 'GL', label: 'Greenland', phone: '299' },
  { code: 'GM', label: 'Gambia', phone: '220' },
  { code: 'GN', label: 'Guinea', phone: '224' },
  { code: 'GP', label: 'Guadeloupe', phone: '590' },
  { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
  { code: 'GR', label: 'Greece', phone: '30' },
  { code: 'GS', label: 'South Georgia and the South Sandwich Islands', phone: '500' },
  { code: 'GT', label: 'Guatemala', phone: '502' },
  { code: 'GU', label: 'Guam', phone: '1-671' },
  { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
  { code: 'GY', label: 'Guyana', phone: '592' },
  { code: 'HK', label: 'Hong Kong', phone: '852' },
  { code: 'HM', label: 'Heard Island and McDonald Islands', phone: '672' },
  { code: 'HN', label: 'Honduras', phone: '504' },
  { code: 'HR', label: 'Croatia', phone: '385' },
  { code: 'HT', label: 'Haiti', phone: '509' },
  { code: 'HU', label: 'Hungary', phone: '36' },
  { code: 'ID', label: 'Indonesia', phone: '62' },
  { code: 'IE', label: 'Ireland', phone: '353' },
  { code: 'IL', label: 'Israel', phone: '972' },
  { code: 'IM', label: 'Isle of Man', phone: '44' },
  { code: 'IN', label: 'India', phone: '91' },
  { code: 'IO', label: 'British Indian Ocean Territory', phone: '246' },
  { code: 'IQ', label: 'Iraq', phone: '964' },
  { code: 'IR', label: 'Iran, Islamic Republic of', phone: '98' },
  { code: 'IS', label: 'Iceland', phone: '354' },
  { code: 'IT', label: 'Italy', phone: '39' },
  { code: 'JE', label: 'Jersey', phone: '44' },
  { code: 'JM', label: 'Jamaica', phone: '1-876' },
  { code: 'JO', label: 'Jordan', phone: '962' },
  { code: 'JP', label: 'Japan', phone: '81', suggested: true },
  { code: 'KE', label: 'Kenya', phone: '254' },
  { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
  { code: 'KH', label: 'Cambodia', phone: '855' },
  { code: 'KI', label: 'Kiribati', phone: '686' },
  { code: 'KM', label: 'Comoros', phone: '269' },
  { code: 'KN', label: 'Saint Kitts and Nevis', phone: '1-869' },
  { code: 'KP', label: "Korea, Democratic People's Republic of", phone: '850' },
  { code: 'KR', label: 'Korea, Republic of', phone: '82' },
  { code: 'KW', label: 'Kuwait', phone: '965' },
  { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
  { code: 'KZ', label: 'Kazakhstan', phone: '7' },
  { code: 'LA', label: "Lao People's Democratic Republic", phone: '856' },
  { code: 'LB', label: 'Lebanon', phone: '961' },
  { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
  { code: 'LI', label: 'Liechtenstein', phone: '423' },
  { code: 'LK', label: 'Sri Lanka', phone: '94' },
  { code: 'LR', label: 'Liberia', phone: '231' },
  { code: 'LS', label: 'Lesotho', phone: '266' },
  { code: 'LT', label: 'Lithuania', phone: '370' },
  { code: 'LU', label: 'Luxembourg', phone: '352' },
  { code: 'LV', label: 'Latvia', phone: '371' },
  { code: 'LY', label: 'Libya', phone: '218' },
  { code: 'MA', label: 'Morocco', phone: '212' },
  { code: 'MC', label: 'Monaco', phone: '377' },
  { code: 'MD', label: 'Moldova, Republic of', phone: '373' },
  { code: 'ME', label: 'Montenegro', phone: '382' },
  { code: 'MF', label: 'Saint Martin (French part)', phone: '590' },
  { code: 'MG', label: 'Madagascar', phone: '261' },
  { code: 'MH', label: 'Marshall Islands', phone: '692' },
  { code: 'MK', label: 'Macedonia, the Former Yugoslav Republic of', phone: '389' },
  { code: 'ML', label: 'Mali', phone: '223' },
  { code: 'MM', label: 'Myanmar', phone: '95' },
  { code: 'MN', label: 'Mongolia', phone: '976' },
  { code: 'MO', label: 'Macao', phone: '853' },
  { code: 'MP', label: 'Northern Mariana Islands', phone: '1-670' },
  { code: 'MQ', label: 'Martinique', phone: '596' },
  { code: 'MR', label: 'Mauritania', phone: '222' },
  { code: 'MS', label: 'Montserrat', phone: '1-664' },
  { code: 'MT', label: 'Malta', phone: '356' },
  { code: 'MU', label: 'Mauritius', phone: '230' },
  { code: 'MV', label: 'Maldives', phone: '960' },
  { code: 'MW', label: 'Malawi', phone: '265' },
  { code: 'MX', label: 'Mexico', phone: '52' },
  { code: 'MY', label: 'Malaysia', phone: '60' },
  { code: 'MZ', label: 'Mozambique', phone: '258' },
  { code: 'NA', label: 'Namibia', phone: '264' },
  { code: 'NC', label: 'New Caledonia', phone: '687' },
  { code: 'NE', label: 'Niger', phone: '227' },
  { code: 'NF', label: 'Norfolk Island', phone: '672' },
  { code: 'NG', label: 'Nigeria', phone: '234' },
  { code: 'NI', label: 'Nicaragua', phone: '505' },
  { code: 'NL', label: 'Netherlands', phone: '31' },
  { code: 'NO', label: 'Norway', phone: '47' },
  { code: 'NP', label: 'Nepal', phone: '977' },
  { code: 'NR', label: 'Nauru', phone: '674' },
  { code: 'NU', label: 'Niue', phone: '683' },
  { code: 'NZ', label: 'New Zealand', phone: '64' },
  { code: 'OM', label: 'Oman', phone: '968' },
  { code: 'PA', label: 'Panama', phone: '507' },
  { code: 'PE', label: 'Peru', phone: '51' },
  { code: 'PF', label: 'French Polynesia', phone: '689' },
  { code: 'PG', label: 'Papua New Guinea', phone: '675' },
  { code: 'PH', label: 'Philippines', phone: '63' },
  { code: 'PK', label: 'Pakistan', phone: '92' },
  { code: 'PL', label: 'Poland', phone: '48' },
  { code: 'PM', label: 'Saint Pierre and Miquelon', phone: '508' },
  { code: 'PN', label: 'Pitcairn', phone: '870' },
  { code: 'PR', label: 'Puerto Rico', phone: '1' },
  { code: 'PS', label: 'Palestine, State of', phone: '970' },
  { code: 'PT', label: 'Portugal', phone: '351' },
  { code: 'PW', label: 'Palau', phone: '680' },
  { code: 'PY', label: 'Paraguay', phone: '595' },
  { code: 'QA', label: 'Qatar', phone: '974' },
  { code: 'RE', label: 'Reunion', phone: '262' },
  { code: 'RO', label: 'Romania', phone: '40' },
  { code: 'RS', label: 'Serbia', phone: '381' },
  { code: 'RU', label: 'Russian Federation', phone: '7' },
  { code: 'RW', label: 'Rwanda', phone: '250' },
  { code: 'SA', label: 'Saudi Arabia', phone: '966' },
  { code: 'SB', label: 'Solomon Islands', phone: '677' },
  { code: 'SC', label: 'Seychelles', phone: '248' },
  { code: 'SD', label: 'Sudan', phone: '249' },
  { code: 'SE', label: 'Sweden', phone: '46' },
  { code: 'SG', label: 'Singapore', phone: '65' },
  { code: 'SH', label: 'Saint Helena', phone: '290' },
  { code: 'SI', label: 'Slovenia', phone: '386' },
  { code: 'SJ', label: 'Svalbard and Jan Mayen', phone: '47' },
  { code: 'SK', label: 'Slovakia', phone: '421' },
  { code: 'SL', label: 'Sierra Leone', phone: '232' },
  { code: 'SM', label: 'San Marino', phone: '378' },
  { code: 'SN', label: 'Senegal', phone: '221' },
  { code: 'SO', label: 'Somalia', phone: '252' },
  { code: 'SR', label: 'Suriname', phone: '597' },
  { code: 'SS', label: 'South Sudan', phone: '211' },
  { code: 'ST', label: 'Sao Tome and Principe', phone: '239' },
  { code: 'SV', label: 'El Salvador', phone: '503' },
  { code: 'SX', label: 'Sint Maarten (Dutch part)', phone: '1-721' },
  { code: 'SY', label: 'Syrian Arab Republic', phone: '963' },
  { code: 'SZ', label: 'Swaziland', phone: '268' },
  { code: 'TC', label: 'Turks and Caicos Islands', phone: '1-649' },
  { code: 'TD', label: 'Chad', phone: '235' },
  { code: 'TF', label: 'French Southern Territories', phone: '262' },
  { code: 'TG', label: 'Togo', phone: '228' },
  { code: 'TH', label: 'Thailand', phone: '66' },
  { code: 'TJ', label: 'Tajikistan', phone: '992' },
  { code: 'TK', label: 'Tokelau', phone: '690' },
  { code: 'TL', label: 'Timor-Leste', phone: '670' },
  { code: 'TM', label: 'Turkmenistan', phone: '993' },
  { code: 'TN', label: 'Tunisia', phone: '216' },
  { code: 'TO', label: 'Tonga', phone: '676' },
  { code: 'TR', label: 'Turkey', phone: '90' },
  { code: 'TT', label: 'Trinidad and Tobago', phone: '1-868' },
  { code: 'TV', label: 'Tuvalu', phone: '688' },
  { code: 'TW', label: 'Taiwan, Province of China', phone: '886' },
  { code: 'TZ', label: 'United Republic of Tanzania', phone: '255' },
  { code: 'UA', label: 'Ukraine', phone: '380' },
  { code: 'UG', label: 'Uganda', phone: '256' },
  { code: 'US', label: 'United States', phone: '1', suggested: true },
  { code: 'UY', label: 'Uruguay', phone: '598' },
  { code: 'UZ', label: 'Uzbekistan', phone: '998' },
  { code: 'VA', label: 'Holy See (Vatican City State)', phone: '379' },
  { code: 'VC', label: 'Saint Vincent and the Grenadines', phone: '1-784' },
  { code: 'VE', label: 'Venezuela', phone: '58' },
  { code: 'VG', label: 'British Virgin Islands', phone: '1-284' },
  { code: 'VI', label: 'US Virgin Islands', phone: '1-340' },
  { code: 'VN', label: 'Vietnam', phone: '84' },
  { code: 'VU', label: 'Vanuatu', phone: '678' },
  { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
  { code: 'WS', label: 'Samoa', phone: '685' },
  { code: 'XK', label: 'Kosovo', phone: '383' },
  { code: 'YE', label: 'Yemen', phone: '967' },
  { code: 'YT', label: 'Mayotte', phone: '262' },
  { code: 'ZA', label: 'South Africa', phone: '27' },
  { code: 'ZM', label: 'Zambia', phone: '260' },
  { code: 'ZW', label: 'Zimbabwe', phone: '263' },
];

export const SignUp = () => {
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
  // const [country, setCountry] = React.useState('');

  // const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   setCountry(event.target.value as string);
  // };

  return (
    <div className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />          
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="./favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="application-name" content="TradePump" />
        <meta name="description" content="Tradepump is not just a Bitcoin and Cryptocurrency Free Aggregator. Come see why our servise is the best place to know crypto exchanges orders books and trades history." />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta name="generator" content="ReactJS"></meta>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="style.css" />
        <title>Bitcoin & Cryptocurrency Free Aggregator | TradePump.com | Create your account</title>
        <meta property="og:title" content="Bitcoin & Cryptocurrency Aggregator | TradePump.com" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tradepump.com/sign-up" />
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
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="firstName"
                    component={TextField}
                    type="text"
                    label="First Name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="lastName"
                    component={TextField}
                    type="text"
                    label="Last Name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    fullWidth
                    required
                    name="username"
                    component={TextField}
                    type="text"
                    label="Username"
                  />
                </Grid>

                <Grid item xs={6}>
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
                <Autocomplete
                  id="country-select-demo"
                  style={{ width: 400, marginTop:20 }}
                  options={countries as CountryType[]}
                  classes={{
                    option: classes.option,
                  }}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  renderOption={(option) => (
                    <React.Fragment>
                      <span>{countryToFlag(option.code)}</span>
                      {option.label} ({option.code}) 
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country of residence *"
                      variant="standard"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    label="By continuing I agree to the"
                    control={
                      <Field
                        name="agreement"
                        component={Checkbox}
                        type="checkbox"
                      />
                    }
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
                  2. There is no such a Username or Email in the DB*/}
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            {/* <pre>{JSON.stringify(values)}</pre> */}
          </form>
        )}
      />
    </div>
  );









//         <div className={classes.signupForm}>
//           <h2 className={classes.title}>Create your account</h2>
//           <form method="POST" action="/sign-up" style={{ display: 'block' }}>
//             <input type="hidden" name="a488a0256d669666eb6e986577e96270faf81fe70c927903d8a801382c5404da" value="b76ebf80de8e53220584"/>
//             <input type="hidden" name="a488a0256d669666eb6e986577e96270faf81fe70c927903d8a801382c5404da-time" value="11.440000031143427"/>
//  {/* E-Mail input             */}
//             <div className={classes.inputField}>
//               <div className="flex relative Field-module_container__2SO49 RetailField-module_retailField__2JJkb RetailField-module_fontWeightRetail__1zq82 Field-module_negative__2LDT6">
//                 <div className="flex w-100 tl items-center">
//                   <div className="flex-auto relative flex items-center h-100 bg-pure-white Field-module_FieldItem__2qUNO RetailField-module_FieldItem__OAxZ1">
//                     <label htmlFor="email" className="text-N300 absolute Field-module_floatingLabel__12Szv text-R300">Email</label>
//                     <input data-testid="signup-email-field" id="email" name="email" className="w-100 text-N600 h-100 Field-module_input__1PIFR body-2 Field-module_floating__BjUHH pl3/2 pr3/2 Field-module_FX_WWW__8FicW" /*value=""*/ />
//                   </div>
//                 </div>
//               </div>
//             </div>
//  {/* Username input             */}
//             <div className="SignupForm-module_usernamePasswordFields__2qidk">
//               <div className="SignupForm-module_usernameField__2kYML">
//                 <div>
//                   <div className="flex relative Field-module_container__2SO49 RetailField-module_retailField__2JJkb RetailField-module_fontWeightRetail__1zq82">
//                     <div className="flex w-100 tl items-center">
//                       <div className="flex-auto relative flex items-center h-100 bg-pure-white Field-module_FieldItem__2qUNO RetailField-module_FieldItem__OAxZ1">
//                         <label htmlFor="username" className="text-N300 absolute Field-module_floatingLabel__12Szv">Username</label>
//                         <input data-testid="signup-username-field" id="username" name="username" className="w-100 text-N600 h-100 Field-module_input__1PIFR w-100 body-2 text-N600 h-100 Field-module_input__1PIFR Field-module_floating__BjUHH Field-module_floating__BjUHH body-2 pl3/2 pr3/2 Field-module_FX_WWW__8FicW" /*value=""*/ />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//  {/* Password input              */}
//               <div className="SignupForm-module_passwordField__yyegQ" data-reach-tooltip-trigger="">
//                 <div className="flex relative Field-module_container__2SO49 RetailField-module_retailField__2JJkb RetailField-module_fontWeightRetail__1zq82">
//                   <div className="flex w-100 tl items-center">
//                     <div className="flex-auto relative flex items-center h-100 bg-pure-white Field-module_FieldItem__2qUNO RetailField-module_FieldItem__OAxZ1">
//                       <label htmlFor="password" className="text-N300 absolute Field-module_floatingLabel__12Szv">Password</label>
//                       <input tabIndex ={0} data-testid="signup-password-field" type="password" id="password" name="password" className="w-100 text-N600 h-100 Field-module_input__1PIFR w-100 body-2 text-N600 h-100 Field-module_input__1PIFR Field-module_withIconRight__2xwIp Field-module_floating__BjUHH Field-module_floating__BjUHH body-2 pl3/2 pr3/2 Field-module_FX_WWW__8FicW" /*value=""*/ />
//                       <button className="flex text-N600 Field-module_iconRight__3psFJ" tabIndex ={0} type="button" data-testid="show password button">show password button
//                         <svg width="20" height="20" className="svg-icon" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//                           <path d="M17.0711 0.514648L18.4853 1.92886L2.92893 17.4852L1.51472 16.071L7.2924 10.2933C7.29249 10.2935 7.29232 10.2931 7.2924 10.2933L11.293 6.29198C11.2928 6.2919 11.2931 6.29206 11.293 6.29198L17.0711 0.514648ZM9.30148 8.28424C9.29572 8.28986 9.29003 8.29555 9.28441 8.3013L9.30148 8.28424Z"></path>
//                           <path d="M8.91264 12.9148C9.26655 12.97 9.62933 12.9999 10 12.9999C13.39 12.9999 16.12 10.4999 17.45 8.99992C16.8805 8.35765 16.0544 7.53204 15.0296 6.79785L16.4612 5.36625C18.6964 7.04448 20 8.99992 20 8.99992C20 8.99992 16 14.9999 10 14.9999C9.0277 14.9999 8.10791 14.8424 7.24916 14.5783L8.91264 12.9148Z"></path>
//                           <path d="M10 2.99992C10.9719 2.99992 11.8912 3.15734 12.7496 3.42118L11.086 5.08481C10.7325 5.02974 10.3702 4.99992 10 4.99992C6.61 4.99992 3.89 7.48993 2.55 8.99992C3.11931 9.64201 3.94515 10.4673 4.96947 11.2014L3.53789 12.6329C1.30328 10.9549 0 8.99992 0 8.99992C0 8.99992 4 2.99992 10 2.99992Z"></path>
//                           <path d="M10.1664 6.00436C10.1113 6.00135 10.0558 5.99983 10 5.99983C8.34315 5.99983 7 7.34297 7 8.99983C7 9.05565 7.00152 9.11112 7.00453 9.16619L10.1664 6.00436Z"></path>
//                           <path d="M9.83216 11.9952C9.88772 11.9983 9.94368 11.9998 10 11.9998C11.6569 11.9998 13 10.6567 13 8.99983C13 8.9435 12.9984 8.88754 12.9954 8.83199L9.83216 11.9952Z"></path>
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//  {/* Select your country button */}
//             <div className="relative pointer border-radius mb3 Dropdown-module_retailField__2VFcM Dropdown-module_fontWeightRetail__20_h9 Dropdown-module_dropdown__1E-NF Dropdown-module_dirty__JoYL3 Dropdown-module_retailDirty__2_CDn" data-testid="country-selector" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="downshift-3-label">
//               <button data-testid="button-toggle-country" className="bg-pure-white relative flex items-center pl3/2 pr3/2 h-100 w-100 tl text-N600 caption-2 Dropdown-module_FieldItem__3wy5h Dropdown-module_button__2_NAp" type="button" role="button" aria-label="open menu" aria-haspopup="true" data-toggle="true" name="country" id="country">
//                 <div className="flex h-100 w-100">
//                   <input type="hidden" name="country" value="PL"/>
//                     <div className="w-100 h-100 relative flex items-center">
//                       <label htmlFor="downshift-3-input" id="downshift-3-label" className="block text-N300 absolute Dropdown-module_label__2oniX Dropdown-module_dirty__JoYL3">Country of residence</label>
//                       <span className="body-2 db w-100 Dropdown-module_value__2e1z6 Dropdown-module_value__3HQYO">
//                         <span className="nowrap">Poland</span>
//                       </span>
//                     </div>
//                   <div className="flex items-center">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M12.001 15.8453L6.33199 10.7433L7.66992 9.25668L12.001 13.1546L16.332 9.25668L17.6699 10.7433L12.001 15.8453Z" fill="#5841D8"></path>
//                     </svg>
//                   </div>
//                 </div>
//               </button>
//             </div>
// {/* Accept agreement tick box             */}
//             <div className={classes.inputField}>
//               <label htmlFor="agreement" data-testid="agreement-checkbox" className="flex items-center">
//                 <div className="Checkbox-module_checkbox__1oJuk flex-shrink-0 SignupForm-module_linkFocusCheckbox__1AK2P mr1">
//                   <div className="Checkbox-module_checkboxWrapper__2Zls-">
//                     <svg width="24" height="24" className="svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"></path>
//                     </svg>
//                     <input id="agreement" name="agreement" type="checkbox"/>
//                   </div>
//                 </div>
//                 <p className="caption-2 text-N400">By continuing I agree to the 
//                   <a target="_BLANK" rel="nooopener noreferrer" className="SignupForm-module_link__17Tw2 SignupForm-module_underlineFocus__341Bu" href="https://www.tradepump.com/terms">Terms and Conditions</a> and 
//                   <a target="_BLANK" rel="nooopener noreferrer" className="SignupForm-module_link__17Tw2 SignupForm-module_underlineFocus__341Bu" href="https://www.tradepump.com/privacy">Privacy Policy</a>.
//                 </p>
//               </label>
//             </div>
//             <div className="SignupForm-module_confirmationWrapper__9iamy">
//               <div className="flex w-100 items-center justify-end mb4 Confirmation-module_confirmation__2jq_G">
//                 <div className="Confirmation-module_buttons__371Ph">
//                   <button className="Button-module_button__wXbPI Button-module_primary__2X85A Button-module_extra-large__1Lr_s Confirmation-module_confirmButton__3ItrC" data-testid="confirm button" type="submit" disabled>
//                     <div className="Button-module_focusRing__qT6o8">
//                       <div className="Button-module_spacer__rMVgk">
//                         <div className="Button-module_buttonInner__21spx SignupForm-module_confirmationButton__2RbmF">Create account</div>
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>         
//         </div>
    
};
