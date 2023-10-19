import { VouchClient } from "../client/VouchClient";

export const BaseClientConfig = (vouchClient: VouchClient) => {
  return {
    baseUrl: "http://localhost:8080/",
    baseHeaders: {
      authorization: "",
    },
  };
};
