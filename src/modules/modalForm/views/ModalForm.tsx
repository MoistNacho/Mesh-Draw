import { ButtonV2, TextInputV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { Roulette } from "modules/roulette/RouletteStore";
import { Vote } from "modules/vote/VoteStore";

import { useModalFormStore } from "../ModalFormProvider";

interface ModalFormProps {
  closeAddForm: VoidFunction;
  addList(item: Vote | Roulette, isUpload?: boolean): void;
  modalType: "vote" | "roulette";
  editData?: Roulette | null;
}

const ModalForm = observer(
  ({ closeAddForm, addList, modalType, editData }: ModalFormProps) => {
    const { modalFormStore } = useModalFormStore();
    const { form, itemNameError } = modalFormStore;
    const {
      handleTitle,
      handleItemsName,
      createListItem,
      removeListItem,
      handleInputError,
      convertVoteItem,
      convertRouletteItem,
      loadEditData,
    } = modalFormStore;

    useEffect(() => {
      if (editData) {
        loadEditData(editData);
      }
    }, [editData, loadEditData]);

    const handleSubmit = () => {
      if (handleInputError()) {
        return;
      }

      if (modalType === "vote") {
        addList(convertVoteItem());
      } else {
        const isEdit = !!editData;
        addList(convertRouletteItem(), !isEdit);
      }

      closeAddForm();
    };

    return (
      <ModalWrap>
        <ModalBackground onClick={closeAddForm} />
        <AddFormWrap>
          <h2>
            {modalType === "vote" ? "새 투표 만들기" : "새 돌림판 만들기"}
          </h2>
          <TitleWrap>
            <LabelWrap>
              <Label>제목</Label>
              {form.errors.title && <Required>{form.errors.title}</Required>}
            </LabelWrap>
            <TextInputV2
              placeholder="주제를 입력하세요"
              value={form.title}
              onChange={(value) => {
                handleTitle("title", value);
              }}
              width="100%"
            />
          </TitleWrap>
          <ItemListWrap>
            <LabelWrap>
              <Label>아이템 리스트</Label>
              {itemNameError && <Required>{itemNameError}</Required>}
            </LabelWrap>
            <ul>
              {form.items.map((item, index) => {
                return (
                  <li key={item.id}>
                    <TextInputV2
                      placeholder={`${index + 1}. 아이템 이름`}
                      value={item.name}
                      width="100%"
                      maxLength={50}
                      onChange={(value) => {
                        handleItemsName(item.id, value);
                      }}
                    />
                    <button
                      className="removeBtn"
                      type="button"
                      onClick={() => {
                        removeListItem(item.id);
                      }}
                      tabIndex={-1}
                    >
                      삭제
                    </button>
                  </li>
                );
              })}
              <ButtonV2
                className="createBtn"
                style={{
                  width: "100%",
                  height: "30px",
                  backgroundColor: "#1e85fa",
                  color: "#fff",
                  border: "none",
                }}
                onClick={createListItem}
              >
                +항목추가
              </ButtonV2>
            </ul>
          </ItemListWrap>
          <ButtonsWrap>
            <ButtonV2
              className="createBtn"
              style={{
                width: "100px",
                height: "40px",
                backgroundColor: "#666",
                color: "#fff",
                border: "none",
              }}
              onClick={closeAddForm}
            >
              취소
            </ButtonV2>
            <ButtonV2
              className="createBtn"
              style={{
                width: "100px",
                height: "40px",
                backgroundColor: "#1e85fa",
                color: "#fff",
                border: "none",
              }}
              onClick={handleSubmit}
            >
              등록
            </ButtonV2>
          </ButtonsWrap>
        </AddFormWrap>
      </ModalWrap>
    );
  },
);

export default ModalForm;

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

const AddFormWrap = styled.article`
  z-index: 10;
  width: 100%;
  max-width: 700px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;

  h2 {
    margin: 0 0 20px;
    text-align: center;
  }
`;

const LabelWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Label = styled.p`
  font-weight: 500;
  font-size: 16px;
  margin: 0;
`;

const Required = styled.p`
  font-size: 14px;
  color: #ff4949;
  margin: 0;

  ::before {
    display: inline;
    content: "⚠ ";
  }
`;

const TitleWrap = styled.div`
  margin-bottom: 20px;
`;

const ItemListWrap = styled.div`
  margin-bottom: 10px;
  ul {
    overflow: scroll;
    max-height: 300px;
    list-style: none;
    padding: 14px 0;
    margin: 0;
    border-top: 2px solid #dfdfdf;
    border-bottom: 2px solid #dfdfdf;

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .removeBtn {
        border: none;
        outline: none;
        padding: 0;
        width: 40px;
        color: #ff4949;
        font-size: 14px;
      }
    }

    .createBtn {
      margin-top: 8px;
    }

    .createBtn:hover {
      background-color: #51a2ff !important;
    }
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: right;
`;
