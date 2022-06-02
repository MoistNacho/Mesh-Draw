import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

import { useVoteStore } from "../VoteProvider";

import VoteItem from "./components/VoteItem";
import VoteModalForm from "./components/VoteModalForm";

const VoteBody = observer(() => {
  const { voteStore } = useVoteStore();
  const { voteList } = voteStore;
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);

  const closeAddForm = () => {
    setOpenAddForm(false);
  };

  return (
    <VoteBodyWrap>
      <TopWrap>
        <ButtonV2
          status="primary"
          style={{ width: "200px", height: "40px", backgroundColor: "#14BE7D" }}
          onClick={() => {
            setOpenAddForm(true);
          }}
        >
          투표 추가
        </ButtonV2>
      </TopWrap>
      <VoteListSection>
        {voteList.map((voteInfo) => {
          return <VoteItem key={voteInfo.id} voteInfo={voteInfo} />;
        })}
      </VoteListSection>
      {openAddForm && <VoteModalForm closeAddForm={closeAddForm} />}
    </VoteBodyWrap>
  );
});

export default VoteBody;

const VoteBodyWrap = styled.div`
  background-color: #558bca;
  /* border-left: 3px solid #558bca;
  border-right: 3px solid #558bca; */
  height: 100%;
  margin: 0 auto;
  color: #303540;

  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const TopWrap = styled.div`
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  }
  button:hover {
    background-color: #42d19a !important;
  }
`;

const VoteListSection = styled.section`
  padding-bottom: 40px;
`;
