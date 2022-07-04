import { ButtonV2, IconV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

import GoogleAuth from "core/GoogleAuth";
import { Roulette } from "modules/roulette/RouletteStore";

interface HistoryModalProps {
  auth: GoogleAuth;
  historyList: Roulette[];
  historyLoading: boolean;
  getHistory: () => void;
  closeHistoryModal: () => void;
  addRoulette: (item: Roulette, isUpload: boolean) => void;
  removeRoulette: (rouletteId: string) => void;
  handleEditHistory: (history: Roulette) => void;
}

const HistoryModal = observer(
  ({
    auth,
    historyList,
    historyLoading,
    getHistory,
    closeHistoryModal,
    addRoulette,
    removeRoulette,
    handleEditHistory,
  }: HistoryModalProps) => {
    const { user } = auth;

    useEffect(() => {
      getHistory();
    }, [getHistory]);

    const loadHistory = useCallback(
      (history: Roulette) => {
        addRoulette(history, false);
        closeHistoryModal();
      },
      [addRoulette, closeHistoryModal],
    );

    return (
      <ModalWrap>
        <ModalBackground onClick={closeHistoryModal} />
        <ModalBodyWrap>
          <h2>돌림판 History</h2>
          <HistoryListWrap>
            {historyList?.length > 0 ? (
              historyList.map((history) => {
                return (
                  <ItemWrap key={history.id}>
                    <div className="top">
                      <p>{history.title}</p>
                      <div>
                        <button
                          type="button"
                          className="loadBtn"
                          onClick={() => {
                            loadHistory(history);
                          }}
                        >
                          <IconV2
                            name="CLOUD_DOWNLOAD"
                            width="18px"
                            height="18px"
                            color="#1e85fa"
                          />{" "}
                          불러오기
                        </button>
                        <button
                          type="button"
                          className="editBtn"
                          onClick={() => {
                            handleEditHistory(history);
                          }}
                        >
                          <IconV2
                            name="SETTINGS"
                            width="18px"
                            height="18px"
                            color="#555"
                          />{" "}
                          수정하기
                        </button>
                        {history.userId === user?.uid && (
                          <button
                            type="button"
                            className="removeBtn"
                            style={{ width: "50px" }}
                            onClick={() => {
                              removeRoulette(history.id);
                            }}
                          >
                            <IconV2
                              name="DELETE"
                              width="18px"
                              height="18px"
                              color="#ff4949"
                            />{" "}
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                    <ul className="items">
                      {history.items.map((item) => {
                        return <li key={item.id}>{item.option}</li>;
                      })}
                    </ul>
                  </ItemWrap>
                );
              })
            ) : (
              <Empty>
                {historyLoading ? "불러오는중..." : "히스토리 정보가 없습니다."}
              </Empty>
            )}
          </HistoryListWrap>
          <ButtonsWrap>
            <ButtonV2 className="closeBtn" onClick={closeHistoryModal}>
              닫기
            </ButtonV2>
          </ButtonsWrap>
        </ModalBodyWrap>
      </ModalWrap>
    );
  },
);

export default HistoryModal;

const ModalWrap = styled.div`
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000050;
`;

const ModalBodyWrap = styled.article`
  z-index: 10;
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;

  h2 {
    color: #555;
    margin: 0 0 20px;
    text-align: center;
  }
`;

const HistoryListWrap = styled.div`
  margin-bottom: 14px;
  padding: 30px 8px;
  border-top: 3px solid #666;
  border-bottom: 3px solid #666;
  overflow: scroll;
  max-height: 400px;

  article:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: right;

  .closeBtn {
    width: 100px;
    height: 40px;
    background-color: #666;
    color: #fff;
    border: none;

    :hover {
      background-color: #818181;
    }
  }
`;

const ItemWrap = styled.article`
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ddd;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0;
      font-weight: 500;
      font-size: 18px;
      color: #555;

      ::before {
        display: inline;
        content: "주제 : ";
        color: #1e85fa;
      }
    }

    button {
      padding: 0;
      height: 30px;
      background-color: #fff;
      border: none;
      font-size: 14px;
      font-weight: 500;
    }

    .loadBtn {
      color: #1e85fa;
    }

    .editBtn {
      margin-left: 10px;
      color: #555;
    }

    .removeBtn {
      margin-left: 10px;
      color: #ff4949;
    }
  }

  .items {
    margin: 0;
    padding: 14px 0;
    list-style: none;
    display: flex;
    overflow-x: scroll;

    li {
      min-width: 100px;
      margin-right: 8px;
      padding: 4px;

      color: #666;
      border: 2px solid #8eadc4;
      border-radius: 4px;
      text-align: center;
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
