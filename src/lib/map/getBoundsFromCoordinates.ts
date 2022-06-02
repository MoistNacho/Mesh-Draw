import { Bounds, LatLng } from "lib/types";

const getBoundsFromCoordinates = (
  coordinates?: LatLng[],
): Bounds | undefined => {
  if (!coordinates || coordinates.length === 0) {
    return undefined;
  }

  return coordinates.reduce<Bounds>(
    ({ ne, sw }, { lat, lng }) => ({
      ne: {
        lat: Math.max(ne.lat, lat),
        lng: Math.max(ne.lng, lng),
      },
      sw: {
        lat: Math.min(sw.lat, lat),
        lng: Math.min(sw.lng, lng),
      },
    }),
    { ne: { lat: 0, lng: -180 }, sw: { lat: 90, lng: 180 } },
  );
};

export default getBoundsFromCoordinates;
