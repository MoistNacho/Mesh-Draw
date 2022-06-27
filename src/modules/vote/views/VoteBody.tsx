import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { ModalFormProvider, ModalForm } from "../../modalForm";
import { useVoteStore } from "../VoteProvider";

import SkeletonItems from "./components/SkeletonItems";
import VoteItem from "./components/VoteItem";

const VoteBody = observer(() => {
  const { voteStore } = useVoteStore();
  const {
    voteList,
    getVoteList,
    addVoteList,
    removeVoteList,
    handleVoting,
    core,
    listLoaded,
  } = voteStore;
  const { googleAuth } = core;
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);

  useEffect(() => {
    getVoteList();
  }, [getVoteList]);

  const handleOpenAddForm = useCallback(() => {
    if (googleAuth.loginCheck()) {
      setOpenAddForm(true);
    }
  }, [googleAuth]);

  const closeAddForm = () => {
    setOpenAddForm(false);
  };

  return (
    <VoteBodyWrap>
      <TopWrap>
        <ButtonV2
          style={{
            width: "200px",
            height: "40px",
            backgroundColor: "#14BE7D",
            border: "none",
            color: "#fff",
          }}
          onClick={handleOpenAddForm}
        >
          투표 추가
        </ButtonV2>
      </TopWrap>
      <VoteListSection>
        {listLoaded ? (
          voteList.map((voteInfo) => {
            return (
              <VoteItem
                key={voteInfo.title}
                auth={googleAuth}
                voteInfo={voteInfo}
                removeVoteList={removeVoteList}
                handleVoting={handleVoting}
              />
            );
          })
        ) : (
          <SkeletonItems />
        )}
      </VoteListSection>
      {openAddForm && (
        <ModalFormProvider>
          <ModalForm
            closeAddForm={closeAddForm}
            addList={addVoteList}
            auth={googleAuth}
            modalType="vote"
          />
        </ModalFormProvider>
      )}
    </VoteBodyWrap>
  );
});

export default VoteBody;

const VoteBodyWrap = styled.div`
  height: 100%;
  color: #303540;

  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const TopWrap = styled.section`
  margin: 40px 0;
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
