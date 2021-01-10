// import express from 'express';

const express = require('express');
const path = require('path');
const app  = express();
const port = 8080;

app.use(express.static(__dirname));

app.get('*', (req, res) =>{
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log('Server started');





// // Require static assets from public folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Set 'views' directory for any views 
// // being rendered res.render()
// app.set('views', path.join(__dirname, 'views'));

// // Set view engine as EJS
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');


// app.get( "/privacy", ( req, res ) => {
//     res.redirect( "privacy" );
// } );

// // app.get( "/monitor", ( req: any, res ) => {
// //     res.render( "/monitor" );
// // } );

// // app.get( "/about", ( req, res ) => {
// //     res.render( "about" );
// // } );

// // start the express server
// app.listen( port, () => {
//     // tslint:disable-next-line:no-console
//     console.log( `server started at http://localhost:${ port }` );
// } );
