import * as React from 'react';
import './../../src/css/index.css'
// import { ChangeEvent, useState } from 'react';
// import { GridList, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
// import { themeStyles } from '../style/postcss';
import { Header } from './Header';
import { OrderMonitorMenu } from './OrderMonitorMenu';
import { TopLogoPanel } from './TopLogoPanel';
import {KrakenPrepareSocket} from './../components/logic/KrakenPrepareSocket'
// import { Clock } from './logic/Clock';
//import { startTime } from './logic/Clock';

type MonitorState = {
  monitor: any;
  data: any;
  currentMonitor: boolean;
  showAll: Array<any>;
}

export class Monitor extends React.Component<{}, MonitorState> {

  // constructor() {
  //   this.change = this.change.bind(this);
  // }
   
  // The tick function sets the current state. TypeScript will let us know
  // which ones we are allowed to set.
  change = () => {
    this.setState({
      currentMonitor: !this.state.currentMonitor,
      monitor: <div> my monitor </div>,
      showAll: [ ]
    });
  }

  // Before the component mounts, we initialise our state
  componentWillMount() {
    // subscribe socket
    KrakenPrepareSocket();
    

    this.setState({
      currentMonitor: true,
      monitor: <div> some monitor </div>,
      // showAll: () => [ <OrderMonitorMenu />, <OrderMonitorMenu />, <OrderMonitorMenu /> ]
      showAll: [ <OrderMonitorMenu />, <OrderMonitorMenu />, <OrderMonitorMenu /> ]
    });
  }

  // After the component did mount, we set the state each second.
  // componentDidMount() {
    
  // }

  // render will know everything!
  render() {


    return (
    
      <div>
        <TopLogoPanel />
        <Header currMonitor={this.state.currentMonitor} />
        <button onClick={this.change}>change</button>

        {this.state.currentMonitor ? <div> order monitor </div> : <div> trade monitor </div> }

        {this.state.monitor}

        {this.state.showAll}

      </div>
    );
  }
}



// export const OrderMonitor = (props: any, state: any) => {
//   console.log('mypops', props, state);
//   return (
    
//     <div>
//       <TopLogoPanel />
//       <Header />
//       <button onClick={() => { }}></button>
//       <OrderMonitorMenu />
      
      

//     </div>
//   );
  
// };
