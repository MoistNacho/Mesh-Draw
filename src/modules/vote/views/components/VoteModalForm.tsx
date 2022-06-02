import { ButtonV2, TextInputV2 } from "@meshkorea/vroong-design-system-web";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { VoteItem } from "modules/vote/VoteStore";

interface VoteModalFormProps {
  closeAddForm: VoidFunction;
}

const defaultItems = [
  { id: 0, name: "", like: 0 },
  { id: 1, name: "", like: 0 },
];

const VoteModalForm = ({ closeAddForm }: VoteModalFormProps) => {
  const [voteTitle, setVoteTitle] = useState<string>("");
  const [voteItems, setVoteItems] = useState<VoteItem[]>(defaultItems);
  const nextItemId = useRef(3);
  //   const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const handleVoteTitle = useCallback(
    (v: string) => {
      setVoteTitle(v);
    },
    [setVoteTitle],
  );

  const changeVoteItemName = useCallback(
    (id: number, value: string) => {
      const newItems = voteItems.map((item) => {
        if (item.id === id) {
          return { ...item, name: value };
        }
        return item;
      });

      setVoteItems(newItems);
    },
    [voteItems, setVoteItems],
  );

  const createVoteItem = useCallback(() => {
    const newItems = [
      ...voteItems,
      {
        id: nextItemId.current,
        name: "",
        like: 0,
      },
    ];
    setVoteItems(newItems);
    nextItemId.current += 1;
  }, [voteItems, setVoteItems]);

  const removeVoteItem = useCallback(
    (id: number) => {
      if (voteItems.length <= 2) {
        return;
      }

      const newItems = voteItems.filter((item) => item.id !== id);
      setVoteItems(newItems);
    },
    [voteItems, setVoteItems],
  );

  return (
    <ModalWrap>
      <ModalBackground onClick={closeAddForm} />
      <AddFormWrap>
        <h2>투표 추가</h2>
        <TitleWrap>
          <Label>제목</Label>
          <TextInputV2
            placeholder="투표 주제를 입력해 주세요"
            value={voteTitle}
            onChange={handleVoteTitle}
            width="100%"
          />
        </TitleWrap>
        <ItemListWrap>
          <Label>투표 아이템리스트</Label>
          <ul>
            {voteItems.map((item, index) => {
              return (
                <li key={item.id}>
                  <TextInputV2
                    placeholder={`${index + 1}. 아이템 이름을 입력해 주세요`}
                    value={item.name}
                    width="100%"
                    maxLength={50}
                    onChange={(value) => {
                      changeVoteItemName(item.id, value);
                    }}
                  />
                  <button
                    className="removeBtn"
                    type="button"
                    onClick={() => {
                      removeVoteItem(item.id);
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
              onClick={createVoteItem}
            >
              +항목추가
            </ButtonV2>
          </ul>
        </ItemListWrap>
      </AddFormWrap>
    </ModalWrap>
  );
};

export default VoteModalForm;

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

const Label = styled.div`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 4px;
`;

const TitleWrap = styled.div`
  margin-bottom: 20px;
`;

const ItemListWrap = styled.div`
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
