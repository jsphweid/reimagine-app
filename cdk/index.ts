import * as cdk from "aws-cdk-lib";

import { ReimagineApp } from "./stack";

const app = new cdk.App();

new ReimagineApp.Stack(app, "ReimagineApp", {
  env: { region: "us-east-1", account: "801215208692" },
});

app.synth();
