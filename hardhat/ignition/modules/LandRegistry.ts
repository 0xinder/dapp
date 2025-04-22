import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";

dotenv.config();

export default buildModule("LandRegistry", (m) => {
    const handshakeA = m.contract("LandRegistry");

    return { handshakeA };
});