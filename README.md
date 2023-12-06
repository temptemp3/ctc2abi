# ctc2abi

Generates arc-4 interface description object from reach contract handle.

## usage

```
import * as backend from "./build/index.main.mjs";
import { generateABI } from "ctc2abi";
import { loadStdlib } from "@reach-sh/stdlib";
import fs from "fs";
const stdlib = loadStdlib(process.env);
const zeroAddress =
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";
const accZero = await stdlib.connectAccount({ addr: zeroAddress });
const ctcZero = accZero.contract(backend);
const schema = await generateABI(ctcZero);
try {
  fs.writeFileSync("contract.json", JSON.stringify(schema));
  // file written successfully
} catch (err) {
  console.error(err);
}
```

## additional information

[arc-4](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)  
[interface description object](https://developer.algorand.org/docs/get-details/dapps/smart-contracts/ABI/#api)  
[reach contract handle](https://docs.reach.sh/frontend/#ref-frontends-js-ctc)
