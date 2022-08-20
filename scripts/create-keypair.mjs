import { generateKeyPair } from "jose";

const { publicKey, privateKey } = await generateKeyPair("EdDSA");
console.log(publicKey.export({ format: "pem", type: "spki" }));
console.log(privateKey.export({ format: "pem", type: "pkcs8" }));
