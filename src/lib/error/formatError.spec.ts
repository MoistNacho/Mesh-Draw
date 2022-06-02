import formatError from "./formatError";

describe("formatError", () => {
  it("이미 formatError로 포매팅된 객체를 입력하면 그대로 반환해야 한다.", async () => {
    // given
    const formattedObject = {
      source: "server" as const,
      displayMessage: "서버에서 오류가 발생했습니다.",
      additionalInfo: "서버에서 오류가 발생했습니다. ",
    };

    // when
    const result = await formatError(formattedObject);

    // then
    expect(result).toEqual(formattedObject);
  });

  it("500을 입력하면 displayError는 '500', additionalInfo는 500이 되어야 한다.", async () => {
    // given
    const input = 500;

    // when
    const result = await formatError(input);

    // then
    expect(result.displayMessage).toBe("500");
    expect(result.additionalInfo).toBe(500);
  });

  it(`undefined을 입력하면 { displayError: "서버에서 오류가 발생했습니다.", source: "server"} 를 반환한다.`, async () => {
    // given
    const input = undefined;

    // when
    const result = await formatError(input);
    const propertyCount = Object.keys(result).length;

    // then
    expect(result.displayMessage).toBe("서버에서 오류가 발생했습니다.");
    expect(result.source).toBe("server");
    expect(propertyCount).toBe(2);
  });

  it(`null을 입력하면 { displayError: "서버에서 오류가 발생했습니다.", source: "server"} 를 반환한다.`, async () => {
    // given
    const input = null;

    // when
    const result = await formatError(input);
    const propertyCount = Object.keys(result).length;

    expect(result.displayMessage).toBe("서버에서 오류가 발생했습니다.");
    expect(result.source).toBe("server");
    expect(propertyCount).toBe(2);
  });

  describe("''(빈 문자열)를 입력하면", () => {
    let emptyString: string;
    beforeEach(() => {
      emptyString = "";
    });

    it("displayMessage는 '서버에서 오류가 발생했습니다.'가 되어야 한다.", async () => {
      // when
      const result = await formatError(emptyString);

      // then
      expect(result.displayMessage).toBe("서버에서 오류가 발생했습니다.");
    });

    it("additionalInfo는 ''가 되어야 한다.", async () => {
      // when
      const result = await formatError(emptyString);

      // then
      expect(result.additionalInfo).toBe("");
    });
  });

  describe("80자 보다 긴 문자열을 입력하면", () => {
    let strLongerThan80Letters: string;
    beforeEach(() => {
      // given
      strLongerThan80Letters =
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
    });

    it("displayMessage는 입력된 문자열의 80번째까지만 표시하고 나머지는 '…'로 생략한 형태의 문자열이 되어야 한다.", async () => {
      // when
      const result = await formatError(strLongerThan80Letters);

      // then
      const expected = `${strLongerThan80Letters.slice(0, 80)}…`;
      expect(result.displayMessage).toBe(expected);
    });

    it("additionalInfo는 입력 값과 동일한 문자열이 되어야 한다.", async () => {
      // when
      const result = await formatError(strLongerThan80Letters);

      // then
      expect(result.additionalInfo).toBe(strLongerThan80Letters);
    });
  });

  describe("HTML 형식의 문자열을 입력하면", () => {
    let htmlFormatString: string;
    beforeEach(() => {
      // given
      htmlFormatString =
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body></body></html>';
    });

    it("displayMessage는 '올바르지 않은 서버 데이터입니다.'가 되어야 한다.", async () => {
      // when
      const result = await formatError(htmlFormatString);

      // then
      expect(result.displayMessage).toBe("올바르지 않은 서버 데이터입니다.");
    });

    it("additionalInfo는 입력 값과 동일한 문자열이 되어야 한다.", async () => {
      // when
      const result = await formatError(htmlFormatString);

      // then
      expect(result.additionalInfo).toBe(htmlFormatString);
    });
  });

  describe("자바스크립트 Error 인스턴스를 입력하면", () => {
    // TODO;
  });
  describe("서버 에러 형식의 객체를 입력하면", () => {
    // TODO;
  });
});
