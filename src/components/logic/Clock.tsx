import * as React from 'react';

/*export function startTime() {
    var dt = new Date();
    document.getElementById("datetime").innerHTML = (("0"+dt.getDate()).slice(-2)) +"."+ (("0"+(dt.getMonth()+1)).slice(-2)) +"."+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2))+":"+ (("0"+dt.getSeconds()).slice(-2));
    var t = setTimeout(startTime, 500);
    }
    */


   // the clock's state has one field: The current time, based upon the
   // JavaScript class Date
   type ClockState = {
     time: Date
   }
   
   // Clock has no properties, but the current state is of type ClockState
   // The generic parameters in the Component typing allow to pass props
   // and state. Since we don't have props, we pass an empty object.
   export class Clock extends React.Component<{}, ClockState> {
   
     // The tick function sets the current state. TypeScript will let us know
     // which ones we are allowed to set.
     tick() {
       this.setState({
         time: new Date()
       });
     }
   
     // Before the component mounts, we initialise our state
     componentWillMount() {
       this.tick();
     }
   
     // After the component did mount, we set the state each second.
     componentDidMount() {
       setInterval(() => this.tick(), 1000);
     }
   
     // render will know everything!
     render() {
        return <p> {this.state.time.toLocaleTimeString()}</p>
     }
   }