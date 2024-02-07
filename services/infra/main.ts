import { TradepumpApp } from "./lib/app";

const app = new TradepumpApp();

// TODO: Uncomment to use remote state management
// Think of local/remote development
/*
new S3Backend(stack, {
  bucket: "terraformbucket",
  key: "terraform.tfstate",
  endpoints: {
    s3: "https://oss.eu-west-0.prod-cloud-ocb.orange-business.com",
  },
});
*/

app.synth();
console.log("Done");