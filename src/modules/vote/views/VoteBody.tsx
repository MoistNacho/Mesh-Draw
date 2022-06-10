import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { ModalFormProvider, ModalForm } from "../../modalForm";
import { useVoteStore } from "../VoteProvider";

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
  } = voteStore;
  const { user, loginCheck } = core.googleAuth;
  const [openAddForm, setOpenAddForm] = useState<boolean>(false);

  useEffect(() => {
    if (!loginCheck) {
      core.dialog.openSpinner();
    } else {
      core.dialog.closeSpinner();
      getVoteList();
    }
  }, [core.dialog, loginCheck, getVoteList]);

  const closeAddForm = () => {
    setOpenAddForm(false);
  };

  return loginCheck ? (
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
          onClick={() => {
            setOpenAddForm(true);
          }}
        >
          투표 추가
        </ButtonV2>
      </TopWrap>
      <VoteListSection>
        {voteList.map((voteInfo) => {
          return (
            <VoteItem
              key={voteInfo.title}
              user={user}
              voteInfo={voteInfo}
              removeVoteList={removeVoteList}
              handleVoting={handleVoting}
            />
          );
        })}
      </VoteListSection>
      {openAddForm && (
        <ModalFormProvider>
          <ModalForm
            closeAddForm={closeAddForm}
            addVoteList={addVoteList}
            user={user}
          />
        </ModalFormProvider>
      )}
    </VoteBodyWrap>
  ) : (
    <></>
  );
});

export default VoteBody;

const VoteBodyWrap = styled.div`
  /* border-left: 3px solid #558bca;
  border-right: 3px solid #558bca; */
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
