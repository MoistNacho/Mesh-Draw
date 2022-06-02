import { inject, Observer } from "mobx-react";
import React, { useRef, useEffect, ReactNode, HTMLAttributes } from "react";
import styled from "styled-components";

import NaverMapStore from "./NaverMapStore";

const Wrapper = styled.div<NaverMapProps>`
  width: ${(props) => props.width || "100%"};
`;

export interface NaverMapProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  naverMapStore?: NaverMapStore;
}

const NaverMap = inject("naverMapStore")((props: NaverMapProps) => {
  const { naverMapStore, ...otherProps } = props;
  const ref = useRef(null);
  useEffect(() => {
    naverMapStore!.setRef(ref.current);
  }, [naverMapStore]);

  return (
    <Observer>
      {() => {
        const { width, height: mapHeight = "480px" } = props;
        const { isLoadingScript, canUseMap } = naverMapStore!;

        let content: ReactNode | undefined;
        if (isLoadingScript) {
          content = <div>Loading...</div>;
        } else if (!canUseMap) {
          content = (
            <div>
              일시적인 통신 오류 또는 네이버측 장애로 네이버 지도 API를 불러오지
              못했습니다. 잠시 후 다시 시도해주세요.
            </div>
          );
        }
        return (
          <Wrapper width={width} height={mapHeight} {...otherProps}>
            <div ref={ref} style={{ width: "100%", height: "100%" }}>
              {content}
            </div>
          </Wrapper>
        );
      }}
    </Observer>
  );
});

export default NaverMap;
