import { Polygon } from "lib/types/NaverMapTypes";

const getCenterOfPolygon = (polygon: Polygon) => {
  const { paths } = polygon;
  const coordinates = paths.map((x) => x.slice()).flat();

  const pathWithEndpoint =
    coordinates.length > 2 &&
    !(
      coordinates[0].lat === coordinates[coordinates.length - 1].lat &&
      coordinates[0].lng === coordinates[coordinates.length - 1].lng
    )
      ? coordinates.concat([coordinates[0]])
      : coordinates;
  const signedArea =
    pathWithEndpoint.reduce(
      (prev, x, idx, arr) =>
        idx < arr.length - 1
          ? prev + x.lng * arr[idx + 1].lat - arr[idx + 1].lng * x.lat
          : prev,
      0,
    ) / 2;
  return {
    lat:
      pathWithEndpoint.reduce(
        (prev, x, idx, arr) =>
          idx < arr.length - 1
            ? prev +
              (x.lat + arr[idx + 1].lat) *
                (x.lng * arr[idx + 1].lat - arr[idx + 1].lng * x.lat)
            : prev,
        0,
      ) /
      (6 * signedArea),
    lng:
      pathWithEndpoint.reduce(
        (prev, x, idx, arr) =>
          idx < arr.length - 1
            ? prev +
              (x.lng + arr[idx + 1].lng) *
                (x.lng * arr[idx + 1].lat - arr[idx + 1].lng * x.lat)
            : prev,
        0,
      ) /
      (6 * signedArea),
  };
};

export default getCenterOfPolygon;
