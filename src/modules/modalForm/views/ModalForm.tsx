import { ButtonV2, TextInputV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { UserType } from "core/services/FireBase";
import { Vote } from "modules/vote/VoteStore";

import { useModalFormStore } from "../ModalFormProvider";

interface ModalFormProps {
  user: UserType;
  closeAddForm: VoidFunction;
  addVoteList(voteItem: Vote): void;
}

const ModalForm = observer(
  ({ user, closeAddForm, addVoteList }: ModalFormProps) => {
    const { modalFormStore } = useModalFormStore();
    const { title, items, itemNameError, titleError } = modalFormStore;
    const {
      handleTitle,
      handleItemsName,
      createListItem,
      removeListItem,
      handleInputError,
    } = modalFormStore;

    const handleSubmit = () => {
      if (handleInputError()) {
        return;
      }

      const newVote = {
        id: "",
        title,
        items,
        userId: user?.uid || "",
        createdAt: new Date().valueOf(),
        participants: [],
      };

      addVoteList(newVote);
      closeAddForm();
    };

    return (
      <ModalWrap>
        <ModalBackground onClick={closeAddForm} />
        <AddFormWrap>
          <h2>투표 추가</h2>
          <TitleWrap>
            <LabelWrap>
              <Label>제목</Label>
              {titleError && <Required>{titleError}</Required>}
            </LabelWrap>
            <TextInputV2
              placeholder="투표 주제"
              value={title}
              onChange={handleTitle}
              width="100%"
            />
          </TitleWrap>
          <ItemListWrap>
            <LabelWrap>
              <Label>투표 아이템리스트</Label>
              {itemNameError && <Required>{itemNameError}</Required>}
            </LabelWrap>
            <ul>
              {items.map((item, index) => {
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
