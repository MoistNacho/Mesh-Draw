import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styled from "styled-components";

const VoteItem = () => {
  return (
    <VoteItemBox>
      <Skeleton width="60%" height={27} style={{ marginLeft: "8px" }} />
      <BodyWrap>
        <Skeleton height={20} style={{ marginBottom: "15px" }} />
        <Skeleton height={20} style={{ marginBottom: "15px" }} />
        <Skeleton height={20} />
      </BodyWrap>
      <ButtonsWrap>
        <Skeleton width={120} height={40} style={{ marginRight: "8px" }} />
        <Skeleton width={120} height={40} />
      </ButtonsWrap>
    </VoteItemBox>
  );
};

const SkeletonItems = () => {
  return (
    <SkeletonWrap>
      <VoteItem />
      <VoteItem />
      <VoteItem />
      <VoteItem />
    </SkeletonWrap>
  );
};

export default SkeletonItems;

const SkeletonWrap = styled.div``;

const VoteItemBox = styled.article`
  max-width: 800px;
  margin: 0 auto 14px;
  background-color: #fff;
  box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  border-radius: 6px;
  padding: 12px;
`;

const BodyWrap = styled.div`
  padding: 14px 6px;
  margin: 10px 0;
  border-top: 2px solid #dfdfdf;
  border-bottom: 2px solid #dfdfdf;
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: right;
`;
