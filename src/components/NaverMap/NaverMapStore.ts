import { forEach } from "lodash-es";
import { observable, action, runInAction } from "mobx";

import { logError } from "lib/error";
import { getBoundsFromPolygons } from "lib/map";
import type {
  LatLng,
  Bounds,
  ListenerMap,
  Marker,
  Polygon,
  Polyline,
  Circle,
} from "lib/types";

import loadNaverMapsJs from "./loadNaverMapsJs";
import { NaverMapProviderProps } from "./NaverMapProvider";

type SupportingOverlay = "markers" | "polygons" | "polylines" | "circles";
export default class NaverMapStore {
  @observable
  public isLoadingScript = true;

  @observable
  public canUseMap = false;

  private ref: HTMLDivElement | null = null;

  // eslint-disable-next-line react/static-property-placement
  private props: NaverMapProviderProps;

  private map?: naver.maps.Map;

  private markers: {
    [key: string]: naver.maps.Marker;
  } = {};

  private polygons: {
    [key: string]: naver.maps.Polygon;
  } = {};

  private polylines: {
    [key: string]: naver.maps.Polyline;
  } = {};

  private circles: {
    [key: string]: naver.maps.Circle;
  } = {};

  private listeners: {
    markers: ListenerMap;
    polygons: ListenerMap;
    polylines: ListenerMap;
    circles: ListenerMap;
  } = {
    markers: {},
    polygons: {},
    polylines: {},
    circles: {},
  };

  constructor(props: NaverMapProviderProps) {
    this.props = props;
    this.loadNaverMapsApi();
  }

  @action.bound
  public setRef(ref: HTMLDivElement | null) {
    this.ref = ref;
    if (!this.isLoadingScript) {
      this.initializeNaverMap();
    }
  }

  @action.bound
  public updateBounds(bounds: Bounds) {
    if (!this.canUseMap || !naver.maps) return;

    const map = this.map!;
    const { onZoomChange, onCenterChange } = this.props;
    map.fitBounds(
      new naver.maps.LatLngBounds(
        new naver.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
        new naver.maps.LatLng(bounds.ne.lat, bounds.ne.lng),
      ),
    );

    if (onZoomChange) {
      onZoomChange(map.getZoom());
    }
    if (onCenterChange) {
      const newCenter = map.getCenter() as naver.maps.LatLng;
      onCenterChange({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
  }

  @action.bound
  public updateZoom(zoom: number) {
    if (!this.canUseMap || !naver.maps) return;

    this.map!.setZoom(zoom);
  }

  @action.bound
  public updateCenter(center: LatLng) {
    if (!this.canUseMap || !naver.maps) return;

    this.map!.setCenter(center);
  }

  @action.bound
  public updateMarkers(markers: Marker[]) {
    if (!this.canUseMap || !naver.maps || !this.map) return;

    const { autoHideMarkers } = this.props;
    const { moveCamera } = this.props.options || { moveCamera: undefined };
    const mapBounds = this.map.getBounds() as naver.maps.LatLngBounds;

    this.trimOverlay("markers", markers);
    markers.forEach((marker) => {
      const { key, position, events, ...options } = marker;

      if (this.markers[key]) {
        if (
          !autoHideMarkers ||
          // @ts-ignore;
          this.markers[key].getIcon().disableAutoHide ||
          mapBounds.hasLatLng(position)
        ) {
          this.markers[key].setMap(this.map!);
          this.markers[key].setPosition(position);
          this.markers[key].setOptions(options);
        } else {
          this.markers[key].setMap(null);
        }
      } else {
        let map;
        if (
          !autoHideMarkers ||
          // @ts-ignore;
          (marker && marker.icon && marker.icon.disableAutoHide) ||
          mapBounds.hasLatLng(position)
        ) {
          map = this.map; // eslint-disable-line
        }
        this.markers[key] = new naver.maps.Marker({
          position,
          ...options,
          map,
        });
      }

      this.updateEvents("markers", key, events);
      if (moveCamera) {
        this.map!.setCenter(position);
      }
    });
  }

  @action.bound
  public updatePolygons(polygons: Polygon[]) {
    if (!this.canUseMap || !naver.maps) return;

    this.trimOverlay("polygons", polygons);
    polygons.forEach(({ key, paths, events, ...options }) => {
      if (this.polygons[key]) {
        this.polygons[key].setPath(paths);
        this.polygons[key].setOptions(options);
      } else {
        this.polygons[key] = new naver.maps.Polygon({
          paths,
          ...options,
          map: this.map,
        });
      }
      this.updateEvents("polygons", key, events);
    });
  }

  @action.bound
  public updatePolylines(polylines: Polyline[]) {
    if (!this.canUseMap || !naver.maps) return;

    this.trimOverlay("polylines", polylines);
    polylines.forEach(({ key, path, events, ...options }) => {
      if (this.polylines[key]) {
        this.polylines[key].setPath(path);
        this.polylines[key].setOptions(options);
      } else {
        this.polylines[key] = new naver.maps.Polyline({
          path,
          ...options,
          map: this.map,
        });
      }
      this.updateEvents("polylines", key, events);
    });
  }

  @action.bound
  public updateCircles(circles: Circle[]) {
    if (!this.canUseMap || !naver.maps) return;

    const { moveCamera } = this.props.options || { moveCamera: undefined };

    this.trimOverlay("circles", circles);
    circles.forEach((circle) => {
      const { key, events, ...options } = circle;

      if (this.circles[key]) {
        this.circles[key].setOptions(options);
      } else {
        this.circles[key] = new naver.maps.Circle({
          ...options,
          map: this.map,
        });
      }
      this.updateEvents("circles", key, events);
      if (moveCamera) {
        this.map!.setCenter(options.center);
      }
    });
  }

  @action.bound
  public clearOverlays(overlayType: SupportingOverlay) {
    if (!this.canUseMap || !naver.maps) return;

    Object.values(this[overlayType]).forEach((overlay) => {
      overlay.setMap(null);
    });
    Object.values(this.listeners[overlayType]).forEach((listener) => {
      Object.keys(listener).forEach((eventType) => {
        naver.maps.Event.removeListener(listener[eventType]);
      });
    });
    this[overlayType] = {};
    this.listeners[overlayType] = {};
  }

  private createMap() {
    if (!this.ref) return;

    const { options } = this.props;

    const naverMapOptions = {
      ...options,
      center:
        options &&
        options.center &&
        new naver.maps.LatLng(options.center.lat, options.center.lng),
      zoomControlOptions: (options && options.zoomControlOptions) || {
        position: naver.maps.Position.TOP_RIGHT,
      },
      mapDataControl: false,
      logoControlOptions: { position: naver.maps.Position.TOP_RIGHT },
      scaleControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    };

    this.map = new naver.maps.Map(this.ref, naverMapOptions)!;
  }

  private registerInitialObjects() {
    const {
      bounds,
      markers,
      polygons,
      polylines,
      circles,
      disableAutoBound,
    } = this.props;
    const map = this.map!;

    if (bounds) {
      map.fitBounds(
        new naver.maps.LatLngBounds(
          new naver.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
          new naver.maps.LatLng(bounds.ne.lat, bounds.ne.lng),
        ),
      );
    }

    if (markers) {
      markers.forEach(({ key, position, events, ...options }) => {
        this.markers[key] = new naver.maps.Marker({
          position,
          ...options,
          map: this.map,
        });
        this.registerEvents("markers", key, events);
      });
    }

    if (polygons) {
      polygons.forEach(({ key, paths, events, ...options }) => {
        this.polygons[key] = new naver.maps.Polygon({
          paths,
          ...options,
          map: this.map,
        });
        this.registerEvents("polygons", key, events);
      });

      if (!disableAutoBound) {
        if (!bounds && polygons.length > 0) {
          const polygonBounds = getBoundsFromPolygons(polygons);
          map.fitBounds(
            new naver.maps.LatLngBounds(
              new naver.maps.LatLng(polygonBounds.sw.lat, polygonBounds.sw.lng),
              new naver.maps.LatLng(polygonBounds.ne.lat, polygonBounds.ne.lng),
            ),
          );
        }
      }
    }

    if (polylines) {
      polylines.forEach(({ key, path, events, ...options }) => {
        this.polylines[key] = new naver.maps.Polyline({
          path,
          ...options,
          map: this.map,
        });
        this.registerEvents("polylines", key, events);
      });
    }

    if (circles) {
      circles.forEach(({ key, events, ...options }) => {
        this.markers[key] = new naver.maps.Marker({
          ...options,
          map: this.map,
        });
        this.registerEvents("circles", key, events);
      });
    }
  }

  private registerInitialEvents() {
    const {
      onMapClick,
      onBoundChange,
      onZoomChange,
      onCenterChange,
      autoHideMarkers,
    } = this.props;
    const map = this.map!;

    if (onMapClick) {
      naver.maps.Event.addListener(
        map,
        "click",
        (e: naver.maps.PointerEvent) => {
          const tm128 = naver.maps.TransCoord.fromLatLngToTM128(e.coord);
          naver.maps.Service.reverseGeocode(
            {
              location: tm128,
              coordType: naver.maps.Service.CoordType.TM128,
            },
            (status, response) => {
              try {
                const { items } = response.result;
                const sido =
                  status === naver.maps.Service.Status.ERROR
                    ? ""
                    : items.reduce(
                        (prev, current) => prev + current.addrdetail.sido,
                        "",
                      );

                if (sido) {
                  onMapClick!(e.coord.y, e.coord.x, false);
                } else {
                  onMapClick!(e.coord.y, e.coord.x, true);
                }
              } catch (exception) {
                onMapClick!(e.coord.y, e.coord.x, true);
              }
            },
          );
        },
      );
    }

    if (onBoundChange) {
      const initialBounds = map.getBounds() as naver.maps.LatLngBounds;
      onBoundChange({
        sw: {
          lat: initialBounds.getSW().lat(),
          lng: initialBounds.getSW().lng(),
        },
        ne: {
          lat: initialBounds.getNE().lat(),
          lng: initialBounds.getNE().lng(),
        },
      });
      naver.maps.Event.addListener(
        this.map,
        "bounds_changed",
        (changedBounds: naver.maps.LatLngBounds) => {
          onBoundChange!({
            sw: {
              lat: changedBounds.getSW().lat(),
              lng: changedBounds.getSW().lng(),
            },
            ne: {
              lat: changedBounds.getNE().lat(),
              lng: changedBounds.getNE().lng(),
            },
          });

          if (onZoomChange) {
            onZoomChange(map.getZoom());
          }

          if (onCenterChange) {
            const center = map.getCenter() as naver.maps.LatLng;
            onCenterChange({
              lat: center.lat(),
              lng: center.lng(),
            });
          }
        },
      );
    }

    if (onZoomChange) {
      onZoomChange(map.getZoom());
      naver.maps.Event.addListener(this.map, "zoom_changed", (zoom: number) => {
        onZoomChange!(zoom);
        if (this.props.clearMarkersOnZoomChange) this.clearOverlays("markers");
      });
    }

    if (onCenterChange) {
      const center = map.getCenter() as naver.maps.LatLng;
      onCenterChange({
        lat: center.lat(),
        lng: center.lng(),
      });
      naver.maps.Event.addListener(
        this.map,
        "center_changed",
        (changedCenter: naver.maps.LatLng) => {
          onCenterChange!({
            lat: changedCenter.lat(),
            lng: changedCenter.lng(),
          });
        },
      );
    }

    if (autoHideMarkers) {
      naver.maps.Event.addListener(map, "idle", () => {
        const mapBounds = map.getBounds() as naver.maps.LatLngBounds;

        const { length: visibleCount } = Object.keys(this.markers).filter(
          (key) => {
            const position = this.markers[key].getPosition();
            return mapBounds.hasLatLng(position);
          },
        );
        if (visibleCount > 500) return;

        forEach(this.markers, (marker) => {
          // @ts-ignore;
          if (marker.getIcon().disableAutoHide) return;
          const position = marker.getPosition();
          if (mapBounds.hasLatLng(position)) {
            if (!marker.getMap()) marker.setMap(map);
          } else if (marker.getMap()) marker.setMap(null);
        });
      });
    }
  }

  private registerEvents = (
    overlayType: SupportingOverlay,
    key: string,
    events?: {
      [eventName: string]: ((...params: unknown[]) => void) | undefined;
    },
  ) => {
    if (!events) {
      return;
    }
    this.listeners[overlayType][key] = Object.keys(events).reduce(
      (prev, eventType) =>
        events[eventType]
          ? {
              ...prev,
              [eventType]: naver.maps.Event.addListener(
                this[overlayType][key],
                eventType,
                (...params: unknown[]) => {
                  events[eventType]!(...params);
                },
              ),
            }
          : prev,
      {},
    );
  };

  private updateEvents = (
    overlayType: SupportingOverlay,
    key: string,
    events?: {
      [eventName: string]: ((...params: unknown[]) => void) | undefined;
    },
  ) => {
    if (events) {
      Object.keys(events).forEach((eventType) => {
        const isEventRegistered =
          this.listeners[overlayType][key] &&
          this.listeners[overlayType][key][eventType];
        if (!isEventRegistered) {
          this.listeners[overlayType][key] =
            this.listeners[overlayType][key] || {};
          if (events[eventType]) {
            this.listeners[overlayType][key][
              eventType
            ] = naver.maps.Event.addListener(
              this[overlayType][key],
              eventType,
              (...params: unknown[]) => {
                events[eventType]!(...params);
              },
            );
          }
        }
      });
    }
    if (this.listeners[overlayType][key]) {
      Object.keys(this.listeners[overlayType][key])
        .filter((eventType) => !(eventType in (events || {})))
        .forEach((eventType) => {
          naver.maps.Event.removeListener(
            this.listeners[overlayType][key][eventType],
          );
          delete this.listeners[overlayType][key][eventType];
        });
    }
  };

  private async loadNaverMapsApi() {
    try {
      await loadNaverMapsJs();
      runInAction(() => {
        this.isLoadingScript = false;
        if (this.ref) {
          this.initializeNaverMap();
        }
      });
    } catch (e) {
      logError(e);
      runInAction(() => {
        this.isLoadingScript = false;
        this.canUseMap = false;
      });
    }
  }

  @action.bound
  private initializeNaverMap() {
    // 이 함수는 ref가 존재하고, isLoadingScript가 true일 때에 실행돼야 한다.
    // 그러나, loadNaverMapsApi와 setRef는 서로 race를 하는 함Js다.
    // 따라서, 양쪽의 일이 끝난 뒤에 각자의 경쟁이 끝났는지 확인한 뒤 이 메서드를 실행하면 안전하다.
    this.createMap();
    this.registerInitialObjects();
    this.registerInitialEvents();
    this.canUseMap = true;
    if (this.props.onCreate) {
      this.props.onCreate(this.map!);
    }
  }

  private trimOverlay(
    overlayType: SupportingOverlay,
    overlays: (Marker | Polygon | Polyline | Circle)[],
  ) {
    Object.keys(this[overlayType])
      .filter((key) => !overlays.find((overlay) => overlay.key === key))
      .forEach((key) => {
        this[overlayType][key].setMap(null);
        if (this.listeners[overlayType][key]) {
          naver.maps.Event.removeListener(
            Object.values(this.listeners[overlayType][key]),
          );
          delete this.listeners[overlayType][key];
        }
        delete this[overlayType][key];
      });
  }
}

// prevent HMR and reload to update changes
if (module.hot) module.hot.decline();
