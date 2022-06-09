import { ButtonV2, IconV2, RadioV2 } from "@meshkorea/vroong-design-system-web";
import React, { useState } from "react";
import styled from "styled-components";

import { UserType } from "core/services/FireBase";

import { Vote } from "../../VoteStore";

interface VoteItemProps {
  user: UserType;
  voteInfo: Vote;
  removeVoteList(id: string): void;
}

const VoteItem = ({ user, voteInfo, removeVoteList }: VoteItemProps) => {
  const [isChecked, setIsChecked] = useState<string>();
  const [openStatistics, setOpenStatistics] = useState<boolean>(false);
  const statisticsTotal = voteInfo.items.reduce<number>(
    (a, b) => a + b.like,
    0,
  );

  const handleOptionCheck = (value: string) => {
    setIsChecked(value);
  };

  const handleStatistics = () => {
    setOpenStatistics(!openStatistics);
  };

  return (
    <VoteItemBox>
      <div className="title">
        <h3>
          주제 : <b>{voteInfo.title}</b>
        </h3>
        {user?.uid === voteInfo.userId && (
          <IconV2
            name="CONTENTS_CLEAR"
            className="delete"
            width="30px"
            height="30px"
            color="#ff4949"
            onClick={() => {
              removeVoteList(voteInfo.id);
            }}
          />
        )}
      </div>
      <BodyWrap>
        {openStatistics ? (
          <StatisticsList>
            {voteInfo.items.map((item) => {
              return (
                <li key={item.id}>
                  <span className="name">{item.name}</span>
                  <ResultBar total={statisticsTotal} like={item.like}>
                    <div className="bar" />
                    <span className="count">
                      {item.like}표{" "}
                      {statisticsTotal >= 1
                        ? ((100 / statisticsTotal) * item.like).toFixed(1)
                        : 0}
                      %
                    </span>
                  </ResultBar>
                </li>
              );
            })}
          </StatisticsList>
        ) : (
          <OptionList>
            {voteInfo.items.map((item) => {
              return (
                <li key={item.id}>
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
        )}
      </BodyWrap>
      <ButtonsWrap>
        <ButtonV2
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "#666",
            color: "#fff",
            border: "none",
          }}
          onClick={handleStatistics}
        >
          {openStatistics ? "돌아가기" : "투표 결과"}
        </ButtonV2>
        <ButtonV2
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "#1e85fa",
            color: "#fff",
            border: "none",
            display: openStatistics ? "none" : "block",
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
  max-width: 800px;
  margin: 0 auto 14px;
  background-color: #fff;
  box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  border-radius: 6px;
  padding: 12px;

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

    .delete:hover {
      color: #fc7171;
    }
  }
`;

const BodyWrap = styled.div`
  padding: 14px 6px;
  margin: 10px 0;
  border-top: 2px solid #dfdfdf;
  border-bottom: 2px solid #dfdfdf;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li:last-child {
      margin-bottom: 0;
    }
  }
`;

const OptionList = styled.ul`
  li {
    height: 30px;
    margin-bottom: 10px;
    padding: 5px 0;
    label {
      color: #505050;
      font-weight: 500;
    }
  }
`;

const StatisticsList = styled.ul`
  .name {
    color: #505050;
    font-size: 14px;
    font-weight: 500;
  }

  li {
    margin-left: 8px;
    margin-bottom: 10px;
  }
`;

const ResultBar = styled.div<{ total: number; like: number }>`
  display: flex;
  margin-top: 4px;
  .bar {
    width: ${(props) => (100 / props.total) * props.like}%;
    height: 12px;
    background-color: #1d99f8;
    border-radius: 10px;
  }

  .count {
    font-size: 12px;
    line-height: 12px;
    margin-left: 8px;
    color: #1d99f8;
    font-weight: 500;
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
