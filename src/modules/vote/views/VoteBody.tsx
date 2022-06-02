import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useVoteStore } from "../VoteProvider";

import VoteItem from "./components/VoteItem";

const VoteBody = observer(() => {
  const { voteStore } = useVoteStore();
  const { voteList } = voteStore;

  return (
    <VoteBodyWrap>
      <TopWrap>
        <ButtonV2
          status="primary"
          style={{ width: "200px", height: "40px", backgroundColor: "#14BE7D" }}
        >
          투표 추가
        </ButtonV2>
      </TopWrap>
      <VoteListSection>
        {voteList.map((voteInfo) => {
          return <VoteItem key={voteInfo.id} voteInfo={voteInfo} />;
        })}
      </VoteListSection>
    </VoteBodyWrap>
  );
});

export default VoteBody;

const VoteBodyWrap = styled.div`
  border-left: 3px solid #558bca;
  border-right: 3px solid #558bca;
  background-color: #ffffff;
  width: 800px;
  height: 100%;
  margin: 0 auto;
  color: #303540;
`;

const TopWrap = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  button:hover {
    background-color: #42d19a !important;
  }
`;

const VoteListSection = styled.section`
  padding: 0 20px;
  padding-bottom: 40px;
`;
