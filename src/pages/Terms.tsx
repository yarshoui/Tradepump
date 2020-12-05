import React from 'react';
import './../../src/css/index.css';
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
// import { BorderColor } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { RadioButtonCheckedTwoTone } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    minWidth: '1600px',
    overflowX: 'auto',
    fontFamily: 'sans-serif',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 400,
    marginLeft: '10px',
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
}));

export const Terms = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      
       <h2>TradePump Terms of Service</h2>
        <p>
          <em>Last Updated: December 4, 2020</em>
        </p>
        <p>Agreement to use the services of TradePump.com.          
        This agreement hereinafter referred to as the "Agreement" is concluded between the TradePump.com service, hereinafter referred to as the "Site" 
        and the user of the services, hereinafter referred to as the "Client" or "User", determining the conditions for purchasing services through the Site.
        </p>
        <p>By accessing the website at <a href="http://tradepump.com">http://tradepump.com</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>
        <h3>1. General Obligations</h3>
        <ol type="a">
          <li> This Agreement is concluded between the Client and the Site at the time of opening the site. 
            By continuing to use the site the Client confirms his agreement with the conditions established by this Agreement.</li>
          <li> The client can be any individual or entity who is able to accept and pay for the service ordered by him in the manner and on the terms established by this Agreement.</li>
          <li> The site administration reserves the right at any time to change, add or delete clauses of this Agreement without notifying the User.</li>
          <li> Continued use of the Site by the User means acceptance of the Agreement and changes made to this Agreement.</li>
        </ol>
        <h3>2. Disclaimer</h3>
        <ol type="a">
          <li>The materials on TradePump's website are provided on an 'as is' basis. TradePump makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</li>
          <li>Further, TradePump does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</li>
        </ol>

        <h3>3. Rights and obligations of the parties</h3>
        <p>The site administration has the right:</p>
        <ol type="a">
        <li> Change the rules for using the Site, as well as change the content of this Site. Changes come into force from the moment the new version of the Agreement is published on the Site.</li>
        <li> Restrict access to the Site in case the User violates the terms of this Agreement.</li>
        </ol>
        <p>The User hasn't right:</p>
        <ol type="a">
        <li> Use any devices, programs, procedures, algorithms and methods, automatic devices or equivalent manual processes to access, acquire, copy or track the content of the Site.</li>
        <li> By any means bypass the navigation structure of the Site to obtain or attempt to obtain any information, documents or materials by any means that are not specifically provided by the services of this Site.</li>
        <li> Violate the security system or authentication on the Site or on any network related to the Site.</li>
        </ol>


        <h3>4. Risk Disclosure and Responsibility</h3>
        <ol type="a">
        <li> You acknowledge and agree that you shall access and use the Tradepump.com servise at your own risk. The risk of loss in trading Digital Asset pairs and Digital Asset and Legal Tender pairs can be substantial. 
          You should, therefore, carefully consider whether such trading is suitable for you in light of your circumstances and financial resources.</li>
        <li> The site is not responsible for any damage (including non-pecuniary damage, loss of money (loss of profit) resulting from the use or inability to use this site.</li>
        <li> The site administration is not responsible for:</li>
        <li> Delays or failures in the process of obtaining information arising from malfunctions on the part of exchanges, as well as any case of malfunctions in telecommunication, computer, electrical and other related systems.</li>
        <li> Actions of transfer systems, banks, payment systems and for delays associated with their work.</li>
        </ol>

        <p><strong>Internet transmission risks.</strong> You acknowledge that there are risks associated with utilizing an Internet-based trading system including, but not limited to, the failure of hardware, software, and Internet connections. You acknowledge that 
          TradePump.com shall not be responsible for any communication failures, disruptions, errors, distortions or delays you may experience when trading via the Services, however caused.</p>
        
        <h3>5. ACCEPTABLE USE</h3>
        <p>When accessing or using the Services, you agree that you will not violate any law, contract, intellectual property or other third-party right or commit a tort, 
          and that you are solely responsible for your conduct while using our Services. Without limiting the generality of the foregoing, you agree that you will not:</p>
          <ul>
            <li>Use our Services in any manner that could interfere with, disrupt, negatively affect or inhibit other users from fully enjoying our Services, or that could damage, disable, overburden or impair the functioning of our Services in any manner;</li>
            <li>Use our Services to pay for, support or otherwise engage in any illegal gambling activities; fraud; money-laundering; or terrorist activities; or other illegal activities;</li>
            <li>Use any robot, spider, crawler, scraper or other automated means or interface not provided by us to access our Services or to extract data;</li>
            <li>Attempt to circumvent any content filtering techniques we employ, or attempt to access any service or area of our Services that you are not authorized to access;</li>
            <li>Develop any third-party applications that interact with our Services without our prior written consent;</li>
            <li>Encourage or induce any third party to engage in any of the activities prohibited under this Section.</li>
          </ul>
          <h3>6. Third-Party Content</h3>
          <p>In using our Services, you may view content provided by third parties, including links to web pages of such parties. We do not control, endorse or adopt any Third-Party Content and shall have no responsibility for Third-Party Content, 
            including without limitation material that may be misleading, incomplete, erroneous, offensive, indecent or otherwise objectionable. 
            In addition, your business dealings or correspondence with such third parties are solely between you and the third parties. 
            We are not responsible or liable for any loss or damage of any sort incurred as the result of any such dealings, and you understand that your use of Third-Party Content, 
            and your interactions with third parties, is at your own risk.</p>
            <p></p>

      
    </div>
  );
};
