import React from 'react';
// import { observer } from 'mobx-react';
// import './../../src/css/index.css';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import { AppStoreBittrex } from 'src/logic/appStoreBittrex';
// interface MonitorProps {
//   storeBittrex: AppStoreBittrex;
// }
// export const BittrexOrdersTable = observer(
//   ({ storeBittrex }: MonitorProps): JSX.Element => {
//     // console.log(store);

//     const { asks, bids } = storeBittrex.askBidTable;

//     return (
//       <table style={{ display: 'inline-block' }}>
//         <thead>
//           <tr style={{ border: 'black solid 2px;' }}>
//             <th>Bittrex</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td align="center"></td>
//             <td className="inline" style={{ border: 'black solid 1px;' }}>
//               <TableContainer component={Paper}>
//                 <Table size="small" aria-label="a dense table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Ask Price</TableCell>
//                       <TableCell align="right">Volume (Qty)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {asks.map((ask) => (
//                       <TableRow key={ask[0]}>
//                         <TableCell component="th" scope="row">
//                           {ask[0]}
//                         </TableCell>
//                         <TableCell align="right">{ask[1]}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </td>
//             <td className="inline" style={{ border: 'black solid 1px;' }}>
//               <TableContainer component={Paper}>
//                 <Table size="small" aria-label="a dense table">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Bid Price</TableCell>
//                       <TableCell align="right">Volume (Qty)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {bids.map((bid) => (
//                       <TableRow key={bid[0]}>
//                         <TableCell component="th" scope="row">
//                           {bid[0]}
//                         </TableCell>
//                         <TableCell align="right">{bid[1]}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     );
//   },
// );
