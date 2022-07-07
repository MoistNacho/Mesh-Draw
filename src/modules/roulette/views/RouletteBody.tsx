import { ButtonV2, IconV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useCallback, useState } from "react";
import Lottie from "react-lottie-player";
import styled from "styled-components";

import lottieJson from "../../../assets/lottie/roulette-congrats.json";
import { Wheel } from "../../../components/CustomWheel";
import { ModalFormProvider, ModalForm } from "../../modalForm";
import { useRouletteStore } from "../RouletteProvider";
import { Roulette } from "../RouletteStore";

import HistoryModal from "./component/HistoryModal";

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
  const {
    core,
    rouletteWheel,
    mustSpin,
    prizeNum,
    drawResult,
    historyList,
    historyLoading,
    animationPlay,
  } = rouletteStore;
  const {
    addRoulette,
    removeRoulette,
    handleSpinClick,
    handleSpinStop,
    getHistory,
  } = rouletteStore;

  const { googleAuth } = core;

  const [openAddForm, setOpenAddForm] = useState<boolean>(false);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [editHistory, setEditHistory] = useState<Roulette | null>(null);

  const handleOpenAddForm = useCallback(() => {
    if (googleAuth.loginCheck()) {
      setOpenAddForm(true);
    }
  }, [googleAuth]);

  const closeAddForm = () => {
    setOpenAddForm(false);
  };

  const closeHistoryModal = () => {
    setOpenHistory(false);
  };

  const handleEditHistory = (history: Roulette) => {
    setEditHistory(history);
    setOpenHistory(false);
    setOpenAddForm(true);
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
          onClick={handleOpenAddForm}
        >
          돌림판 추가
        </ButtonV2>
      </TopWrap>
      <HistoryWrap>
        <ButtonV2
          style={{
            width: "120px",
            height: "30px",
            backgroundColor: "#fff",
            color: "#666",
            border: "none",
          }}
          onClick={() => {
            setOpenHistory(true);
          }}
        >
          <IconV2 name="HISTORY" width="20px" height="20px" color="#666" />{" "}
          History
        </ButtonV2>
      </HistoryWrap>
      <WheelSection>
        {rouletteWheel ? (
          <WheelWrap>
            <h3 className="title">{rouletteWheel.title}</h3>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNum}
              spinDuration={0.7}
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
            {drawResult && (
              <ResultWrap>
                {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
                <h3>🎉 당 첨 🎉</h3>
                <p>{drawResult}</p>
              </ResultWrap>
            )}
            {animationPlay && (
              <LottieWrap>
                <Lottie
                  loop
                  animationData={lottieJson}
                  play
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </LottieWrap>
            )}
          </WheelWrap>
        ) : (
          <Empty>설정된 룰렛이 없습니다. 새로 등록해주세요</Empty>
        )}
      </WheelSection>

      {openAddForm && (
        <ModalFormProvider>
          <ModalForm
            closeAddForm={closeAddForm}
            modalType="roulette"
            addList={addRoulette}
            editData={editHistory}
          />
        </ModalFormProvider>
      )}
      {openHistory && (
        <HistoryModal
          auth={googleAuth}
          historyList={historyList}
          historyLoading={historyLoading}
          getHistory={getHistory}
          closeHistoryModal={closeHistoryModal}
          addRoulette={addRoulette}
          removeRoulette={removeRoulette}
          handleEditHistory={handleEditHistory}
        />
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
  position: relative;
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
  position: relative;
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

const LottieWrap = styled.div`
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 30;
  pointer-events: none;

  @media screen and (max-width: 600px) {
    top: 0;
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

const ResultWrap = styled.div`
  padding: 10px;
  margin: 20px 0;
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
`;

const HistoryWrap = styled.div`
  width: 800px;
  margin: 0 auto 10px;
  display: flex;
  justify-content: right;

  button {
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 18%), 0 4px 8px 0 rgb(0 0 0 / 15%);
  }

  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
