import { likeHtmlRegExp } from "lib/regExps";

describe("regExps", () => {
  describe("HTML 형식의 문자열인지 검증하는 정규 표현식", () => {
    it("'<html></html>'이 입력되면 true를 반환한다.", () => {
      // given
      const input = "<html></html>";

      // when
      const result = likeHtmlRegExp.test(input);

      // then
      expect(result).toBe(true);
    });

    it("'올바른 오더 권역이 아닙니다<에러코드: 테스트>'이 입력되면 false를 반환한다.", () => {
      // given
      const input = "올바른 오더 권역이 아닙니다<에러코드: 테스트>";

      // when
      const result = likeHtmlRegExp.test(input);

      // then
      expect(result).toBe(false);
    });

    it("'<!doctype html>'로 시작하는 문자열이 입력되면 true를 반환한다.", () => {
      // given
      const input =
        '<!doctype html><html lang="en"><head><title>HTTP Status 400 – Bad Request</title><style type="text/css">h1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} h2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} h3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} body {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} b {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} p {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;} a {color:black;} a.name {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 400 – Bad Request</h1></body></html>';

      // when
      const result = likeHtmlRegExp.test(input);

      // then
      expect(result).toBe(true);
    });

    it(`inline 스타일이 적용된 <body>가 있는 문자열이 입력되면 true를 반환한다.`, () => {
      // given
      const input = `<body class="light-chip mac" style="width: 100px;"><div><div></body>`;

      // when
      const result = likeHtmlRegExp.test(input);

      // then
      expect(result).toBe(true);
    });

    it(`<div>가 닫히지 않아서 HTML 문법에 안맞는 문자열이 입력되면 true를 반환한다.`, () => {
      // given
      const input = `<div>sample test<span>span text</span>`;

      // when
      const result = likeHtmlRegExp.test(input);

      // then
      expect(result).toBe(true);
    });

    it(`XML 형식의 문자열이 입력되면 true를 반환한다.`, () => {
      // given
      const input = `<?xml version="1.0" encoding="UTF-8"?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don't forget me this weekend!</body></note>`;

      // when
      const result = likeHtmlRegExp.test(input);

      // then
      expect(result).toBe(true);
    });
  });
});
