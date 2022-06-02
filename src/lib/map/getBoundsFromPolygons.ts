import { Polygon } from "lib/types";

const getBoundsFromPolygons = (polygons: Polygon[]) => {
  return polygons.reduce(
    (polygonPrev, selectedPolygon) =>
      selectedPolygon.paths
        .map((x) => x.slice())
        .flat()
        .reduce(
          (coordinatePrev, coordinate) => ({
            sw: {
              lat:
                coordinatePrev.sw.lat > coordinate.lat
                  ? coordinate.lat
                  : coordinatePrev.sw.lat,
              lng:
                coordinatePrev.sw.lng > coordinate.lng
                  ? coordinate.lng
                  : coordinatePrev.sw.lng,
            },
            ne: {
              lat:
                coordinatePrev.ne.lat < coordinate.lat
                  ? coordinate.lat
                  : coordinatePrev.ne.lat,
              lng:
                coordinatePrev.ne.lng < coordinate.lng
                  ? coordinate.lng
                  : coordinatePrev.ne.lng,
            },
          }),
          polygonPrev,
        ),
    {
      sw: { lat: 90, lng: 180 },
      ne: { lat: 0, lng: 0 },
    },
  );
};

export default getBoundsFromPolygons;
