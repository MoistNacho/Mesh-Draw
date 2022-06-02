import { likeHtmlRegExp } from "lib/regExps";

import DefaultError from "./DefaultError";
import PrimeError from "./PrimeError";

export default async function formatError(
  errorRes?:
    | PrimeError
    | DefaultError
    | Response
    | Error
    | string
    | number
    | null,
): Promise<DefaultError> {
  // string, number, undefined - 서버에서 제대로 오류를 컨트롤해서 주지 않은 경우
  if (typeof errorRes === "string") {
    if (likeHtmlRegExp.test(errorRes)) {
      return {
        source: "server",
        displayMessage: "올바르지 않은 서버 데이터입니다.",
        additionalInfo: errorRes,
      };
    }
    return {
      source: "server",
      displayMessage:
        shortenErrorMessage(errorRes) || "서버에서 오류가 발생했습니다.",
      additionalInfo: errorRes,
    };
  }
  if (typeof errorRes === "number") {
    return {
      source: "server",
      displayMessage: errorRes.toString(),
      additionalInfo: errorRes,
    };
  }
  if (typeof errorRes === "undefined" || errorRes === null) {
    return {
      source: "server",
      displayMessage: "서버에서 오류가 발생했습니다.",
    };
  }

  // 이미 formattedError인 경우
  if ((errorRes as DefaultError).displayMessage) {
    return errorRes as DefaultError;
  }

  // Error: JavaScript Error
  if (errorRes instanceof Error) {
    // developer defined error
    if (errorRes.name === "Error") {
      return {
        source: "client",
        displayMessage: errorRes.message,
        additionalInfo: errorRes,
      };
    }

    // network error
    const isNetworkError = !!networkErrors.find((x) =>
      errorRes.message.startsWith(x),
    );
    if (isNetworkError) {
      return {
        source: "network",
        displayMessage: "네트워크 오류가 발생했습니다.",
        additionalInfo: errorRes,
      };
    }

    // undefined client error
    return {
      source: "client",
      errorCode: errorRes.name,
      displayMessage: "클라이언트에서 오류가 발생했습니다.",
      additionalInfo: errorRes,
    };
  }

  let serverError;
  if (isResponse(errorRes)) {
    serverError = await errorRes.json();
  } else {
    serverError = errorRes;
  }

  // Other server error
  let displayMessage =
    serverError.errorMessage || "서버에서 알 수 없는 오류가 발생했습니다.";
  if (serverError.errorCode === "INTERNAL_SERVER_ERROR") {
    displayMessage = "서버에서 내부 오류가 발생했습니다.";
  }

  return {
    source: "server",
    errorCode: serverError.errorCode,
    displayMessage,
    additionalInfo: serverError,
    ...(isResponse(errorRes) && {
      status: errorRes.status,
      response: errorRes,
    }),
  };
}

const shortenErrorMessage = (str: string) =>
  str.length > 80 ? `${str.slice(0, 80)}…` : str;

export const networkErrors = [
  "A network error",
  "Network Error",
  "Failed to fetch",
  "네트워크 연결이 유실되었습니다",
  "요청한 시간이 초과되었습니다",
  "인터넷 연결이 오프라인 상태입니다",
  "fetch하지 못함",
  "Loading chunk",
];

const isResponse = (x: unknown): x is Response => {
  return (x as Response).json !== undefined;
};
