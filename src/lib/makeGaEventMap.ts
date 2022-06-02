import { mapValues } from "lodash-es";

// eslint-disable-next-line @typescript-eslint/ban-types
const makeGaEventMap = <T extends object>(
  gaEventMapWithoutCategory: T,
  category: string,
) =>
  (mapValues(gaEventMapWithoutCategory, (value) => {
    return {
      category,
      ...value,
    };
  }) as unknown) as {
    [key in keyof T]: {
      category: string;
      action: string;
    };
  };

export default makeGaEventMap;
