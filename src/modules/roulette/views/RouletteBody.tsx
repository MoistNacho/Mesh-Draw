import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import styled from "styled-components";

import { ModalFormProvider, ModalForm } from "../../modalForm";
import { useRouletteStore } from "../RouletteProvider";

const rouletteColors = [
  "#ee3a43",
  "#f8a14b",
  "#32dc79",
  "#535353",
  "#46AEFF",
  "#b043e7",
  "#ef6ee0",
  "#a04949",
  "#539c78",
  "#6063bc",
];

const RouletteBody = observer(() => {
  const { rouletteStore } = useRouletteStore();
  const { rouletteWheel, mustSpin, prizeNum, drawResult } = rouletteStore;
  const { addRouletteList, handleSpinClick, handleSpinStop } = rouletteStore;

  const [openAddForm, setOpenAddForm] = useState<boolean>(false);

  const closeAddForm = () => {
    setOpenAddForm(false);
  };

  return (
    <RouletteBodyWrap>
      <TopWrap>
        <ButtonV2
          style={{
            width: "200px",
            height: "40px",
            backgroundColor: "#f06c6c",
            border: "none",
            color: "#fff",
          }}
          onClick={() => {
            setOpenAddForm(true);
          }}
        >
          돌림판 추가
        </ButtonV2>
      </TopWrap>
      <WheelSection>
        {rouletteWheel ? (
          <WheelWrap>
            <h3 className="title">{rouletteWheel.title}</h3>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNum}
              spinDuration={0.35}
              data={rouletteWheel.items}
              outerBorderColor="#5c5c5c"
              outerBorderWidth={8}
              innerBorderColor="#ffffff"
              radiusLineColor="#ffffff"
              radiusLineWidth={5}
              textColors={["#ffffff"]}
              fontSize={20}
              perpendicularText
              backgroundColors={rouletteColors}
              onStopSpinning={handleSpinStop}
            />
            <ButtonV2
              style={{
                width: "120px",
                height: "40px",
                backgroundColor: "#888",
                color: "#fff",
                border: "none",
                margin: "20px 0 0",
              }}
              onClick={handleSpinClick}
            >
              {drawResult ? "다시 돌리기" : "돌리기"}
            </ButtonV2>
          </WheelWrap>
        ) : (
          <Empty>설정된 룰렛이 없습니다. 새로 등록해주세요</Empty>
        )}
      </WheelSection>
      {drawResult && (
        <ResultSection>
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          <h3>🎉 당 첨 🎉</h3>
          <p>{drawResult}</p>
        </ResultSection>
      )}

      {openAddForm && (
        <ModalFormProvider>
          <ModalForm
            closeAddForm={closeAddForm}
            modalType="roulette"
            addList={addRouletteList}
          />
        </ModalFormProvider>
      )}
    </RouletteBodyWrap>
  );
});

export default RouletteBody;

const RouletteBodyWrap = styled.div`
  position: relative;
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
    background-color: #ec7c7c !important;
  }
`;

const WheelSection = styled.section`
  width: 800px;
  padding: 30px;
  margin: 0 auto 40px;
  background-color: #fff;
  box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  border-radius: 6px;

  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 20px;
  }
`;

const WheelWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    width: 100%;
    text-align: left;
    margin: 0 0 20px;
    font-size: 18px;

    ::before {
      display: inline;
      color: #f06c6c;
      content: "주제 : ";
    }
  }
`;

const Empty = styled.p`
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ababab;

  ::before {
    display: inline;
    content: "⚠ ";
  }
`;

const ResultSection = styled.section`
  width: 600px;
  padding: 20px;
  margin: 0 auto 40px;
  background-color: #fff;
  box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    margin: 0 0 10px;
    font-size: 22px;
    line-height: 22px;
    color: #428ced;
  }

  p {
    font-weight: 500;
    color: #555;
    font-size: 30px;
    line-height: 30px;

    margin: 0;
  }

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;
