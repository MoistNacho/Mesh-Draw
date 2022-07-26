/* eslint-disable spaced-comment */
import ModalFormCommand from "./ModalFormCommand";

describe("ModalFormCommand", () => {
  let modalFormCommand = new ModalFormCommand();

  beforeEach(() => {
    modalFormCommand = new ModalFormCommand();
  });

  describe("Title Tests", () => {
    it("title의 값이 비어있을 경우 오류를 반환해야 한다", async () => {
      //given
      modalFormCommand.update({ title: "" });
      //when
      await modalFormCommand.validate();
      //then
      expect(modalFormCommand.errors.title).toBe("타이틀은 필수 입력값입니다.");
    });

    it("title의 값이 2글자 미만일 경우 오류를 반환해야 한다", async () => {
      //given
      modalFormCommand.update({ title: "a" });
      //when
      await modalFormCommand.validate();
      //then
      expect(modalFormCommand.errors.title).toBe(
        "타이틀은 2글자 이상으로 입력해주세요.",
      );
    });

    it("title의 값이 2글자 이상일 경우 errors.title의 값이 undefind여야 한다", async () => {
      //given
      modalFormCommand.update({ title: "제목입니다" });
      //when
      await modalFormCommand.validate();
      //then
      expect(modalFormCommand.errors.title).toBe(undefined);
    });
  });

  describe("Items Test", () => {
    it("items배열의 아이템이 2개 미만일 경우 오류를 반환해야 한다", async () => {
      //given
      modalFormCommand.update({ items: [{ id: 1, name: "abc" }] });
      //when
      await modalFormCommand.validate();
      //then
      expect(modalFormCommand.errors.items).toBe(
        "리스트 아이템은 최소 2개 이상 최대 10개 이하 선택해주세요.",
      );
    });

    it("items배열의 아이템이 10개 초과일 경우 오류를 반환해야 한다", async () => {
      //given
      modalFormCommand.update({
        items: [
          { id: 1, name: "첫번째" },
          { id: 2, name: "두번째" },
          { id: 3, name: "세번째" },
          { id: 4, name: "네번째" },
          { id: 5, name: "다섯번째" },
          { id: 6, name: "여섯번째" },
          { id: 7, name: "일곱번째" },
          { id: 8, name: "여덟번째" },
          { id: 9, name: "아홉번째" },
          { id: 10, name: "열번째" },
          { id: 11, name: "열한번째" },
        ],
      });
      //when
      await modalFormCommand.validate();
      //then
      expect(modalFormCommand.errors.items).toBe(
        "리스트 아이템은 최소 2개 이상 최대 10개 이하 선택해주세요.",
      );
    });

    it("items배열 아이템중 name이 비어있을 경우 검증에 실패해야한다", async () => {
      //given
      modalFormCommand.update({
        items: [
          { id: 1, name: "" },
          { id: 2, name: "" },
        ],
      });
      //when
      await modalFormCommand.validate();
      //then
      expect(modalFormCommand.isValid).toBeFalsy();
    });
  });
});
