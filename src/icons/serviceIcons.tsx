// icons/serviceIcons.tsx

import {
  FaCloud,
  FaServer,
  FaLaptopCode,
  FaShieldAlt,
  FaNetworkWired,
  FaDatabase,
  FaWifi,
  FaCode,
} from "react-icons/fa";

import { IconType } from "react-icons";

export const serviceIcons: Record<string, IconType> = {
  cloud: FaCloud,
  server: FaServer,
  development: FaLaptopCode,
  security: FaShieldAlt,
  network: FaNetworkWired,
  database: FaDatabase,
  internet: FaWifi,
  software: FaCode,
};