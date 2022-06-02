import { LatLng } from "lib/types";

interface KeyAndEvents {
  key: string;
  events?: {
    [eventName: string]: ((...params: unknown[]) => void) | undefined;
  };
}

export interface Marker extends naver.maps.MarkerOptions, KeyAndEvents {
  position: LatLng;
}

export interface Polygon extends naver.maps.PolygonOptions, KeyAndEvents {
  paths: LatLng[][];
}

export interface Polyline extends naver.maps.PolylineOptions, KeyAndEvents {
  path: LatLng[];
}

export interface Circle extends naver.maps.CircleOptions, KeyAndEvents {
  center: LatLng;
}

export interface Bounds {
  sw: LatLng;
  ne: LatLng;
}

export interface ListenerMap {
  [key: string]: {
    [eventName: string]: naver.maps.MapEventListener;
  };
}

export interface MapOptions extends naver.maps.MapOptions {
  center?: LatLng;
  moveCamera?: boolean;
}
