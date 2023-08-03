const es2015 = require('babel-preset-es2015');
const presetReact = require('babel-preset-react');
require("babel-register")({
  presets: [es2015, presetReact]
});
//Import our routes
const router = require("./routes").default;

function generateSitemap() {
  throw new Error("Implement new version")
//   new Sitemap(router())
//   .build("https://tradepump.com")
//  //Save it wherever you want
//   .save("../public/sitemap.xml")
}

generateSitemap();
//run node sitemap-generator.js to create the xml
