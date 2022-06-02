import React, { useState, useEffect, createContext, useContext } from "react";
import { hot } from "react-hot-loader/root";

import Core, { useCore } from "core";
import LatLng from "lib/types/LatLng";
import {
  Bounds,
  Marker,
  Polygon,
  Polyline,
  MapOptions,
  Circle,
} from "lib/types/NaverMapTypes";

import NaverMap, { NaverMapProps } from "./NaverMap";
import NaverMapStore from "./NaverMapStore";

interface LocalStores {
  core: Core;
  naverMapStore: NaverMapStore;
}

const LocalContext = createContext<LocalStores>(
  (null as unknown) as LocalStores,
);

export const useNaverMapStores = () => {
  const stores = useContext(LocalContext);
  if (!stores) {
    throw new Error("useStore must be used within a LocalContext Provider");
  }
  return stores;
};

export interface NaverMapProviderProps extends NaverMapProps {
  options?: MapOptions;
  zoom?: number;
  center?: LatLng;
  bounds?: Bounds;
  markers?: Marker[];
  polygons?: Polygon[];
  polylines?: Polyline[];
  circles?: Circle[];
  onMapClick?: (lat: number, lng: number, isError?: boolean) => void;
  onZoomChange?: (zoom: number) => void;
  onBoundChange?: (bounds: Bounds) => void;
  onCenterChange?: (center: LatLng) => void;
  onCreate?: (map: naver.maps.Map) => void;
  disableAutoBound?: boolean;
  autoHideMarkers?: boolean;
  clearMarkersOnZoomChange?: boolean;
}

const NaverMapProvider = (props: NaverMapProviderProps) => {
  const {
    zoom,
    center,
    bounds,
    markers,
    polygons,
    polylines,
    circles,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onMapClick,
    onZoomChange,
    onBoundChange,
    onCenterChange,
    onCreate,
    disableAutoBound,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...naverMapProps
  } = props;
  const core = useCore();
  const [stores] = useState(() => {
    const naverMapStore = new NaverMapStore(props);
    return {
      core,
      naverMapStore,
    };
  });
  const { naverMapStore: store } = stores;
  useEffect(() => {
    if (bounds) store.updateBounds(bounds);
  }, [bounds, store]);

  useEffect(() => {
    if (zoom) store.updateZoom(zoom);
  }, [zoom, store]);
  useEffect(() => {
    if (center) store.updateCenter(center);
  }, [center, store]);

  useEffect(() => {
    if (markers) store.updateMarkers(markers);
    else store.clearOverlays("markers");
  }, [markers, store]);
  useEffect(() => {
    if (polygons) store.updatePolygons(polygons);
    else store.clearOverlays("polygons");
  }, [polygons, store]);
  useEffect(() => {
    if (polylines) store.updatePolylines(polylines);
    else store.clearOverlays("polylines");
  }, [polylines, store]);
  useEffect(() => {
    if (circles) store.updateCircles(circles);
    else store.clearOverlays("circles");
  }, [circles, store]);

  return (
    <LocalContext.Provider value={stores}>
      <NaverMap {...naverMapProps} />
    </LocalContext.Provider>
  );
};

export default hot(NaverMapProvider);
