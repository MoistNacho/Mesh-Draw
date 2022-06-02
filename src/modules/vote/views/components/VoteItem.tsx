import { ButtonV2, IconV2, RadioV2 } from "@meshkorea/vroong-design-system-web";
import React, { useState } from "react";
import styled from "styled-components";

import { Vote } from "../../VoteStore";

interface VoteItemProps {
  voteInfo: Vote;
}

const VoteItem = ({ voteInfo }: VoteItemProps) => {
  const [isChecked, setIsChecked] = useState<string>();

  const handleOptionCheck = (value: string) => {
    setIsChecked(value);
  };

  return (
    <VoteItemBox key={voteInfo.id}>
      <div className="title">
        <h3>
          주제 : <b>{voteInfo.title}</b>
        </h3>
        <IconV2
          name="CONTENTS_CLEAR"
          className="delete"
          width="30px"
          height="30px"
          color="#ff4949"
        />
      </div>
      <OptionList>
        {voteInfo.items.map((item) => {
          return (
            <li>
              <RadioV2
                id={item.name}
                label={item.name}
                value={item.name}
                checked={isChecked === item.name}
                onChange={handleOptionCheck}
                className="radio"
              />
            </li>
          );
        })}
      </OptionList>
      <ButtonsWrap>
        <ButtonV2
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "#666",
            color: "#fff",
            border: "none",
          }}
        >
          투표 결과
        </ButtonV2>
        <ButtonV2
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "#1e85fa",
            color: "#fff",
            border: "none",
          }}
        >
          투표
        </ButtonV2>
      </ButtonsWrap>
    </VoteItemBox>
  );
};

export default VoteItem;

const VoteItemBox = styled.article`
  background-color: #fff;
  border: 2px solid #1e85fa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 14px;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      padding-left: 8px;
      font-size: 18px;
      color: #166fe4;

      margin: 0;

      b {
        color: #353535;
      }
    }

    .delete {
      cursor: pointer;
    }
  }
`;

const OptionList = styled.ul`
  list-style: none;
  padding: 14px 6px;
  margin: 10px 0;
  border-top: 2px solid #dfdfdf;
  border-bottom: 2px solid #dfdfdf;

  li {
    margin-bottom: 4px;
    label {
      color: #505050;
      font-weight: 500;
    }
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: right;

  button:nth-child(1):hover {
    background-color: #888888 !important;
  }

  button:nth-child(2):hover {
    background-color: #51a2ff !important;
  }
`;
