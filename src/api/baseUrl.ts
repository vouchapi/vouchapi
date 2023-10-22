import { VouchClient, VouchClientOptions } from "../client/VouchClient";

export const BaseClientConfig = (options: VouchClientOptions) => {
  return {
    baseUrl: options.host,
    baseHeaders: {
      "x-client-key": options.apiKey,
      "x-client-secret": options.apiSecret,
    },
  };
};
