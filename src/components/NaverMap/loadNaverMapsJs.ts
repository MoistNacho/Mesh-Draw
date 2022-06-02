import loadjs from "loadjs";

import { getNaverMapsApiUrl } from "config";

// eslint-disable-next-line require-await
const loadNaverMapsJs = async () => {
  return new Promise<void>((resolve, reject) => {
    loadjs.ready("naverMaps", () => {
      resolve();
    });

    loadjs([getNaverMapsApiUrl()], "naverMaps", {
      success: () => {
        // @ts-ignore
        const naverMaps = window.naver.maps;
        if (naverMaps.jsContentLoaded) {
          resolve();
        }
        naverMaps.onJSContentLoaded = () => {
          resolve();
        };
      },
      error: reject,
    });
  });
};

export default loadNaverMapsJs;
