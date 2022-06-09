import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { hot } from "react-hot-loader/root";
import { useHistory } from "react-router";
import styled from "styled-components";

import { useCore } from "core";

const HomePage = observer(() => {
  const core = useCore();
  const { isLoggedIn, user, logout, loginCheck } = core.googleAuth;
  const history = useHistory();

  const onLogin = useCallback(() => {
    core.googleAuth.googleLogin();
  }, [core.googleAuth]);

  return loginCheck ? (
    <HomeBodyWrap>
      <Title
        onClick={() => {
          logout();
        }}
      >
        {isLoggedIn ? `${user?.displayName}님 환영합니다` : "Mesh Draw"}
      </Title>
      <ButtonsWrap>
        {isLoggedIn ? (
          <>
            <ButtonV2
              onClick={() => {
                history.push("/vote");
              }}
            >
              투표하기
            </ButtonV2>
            <ButtonV2 disabled>미구현</ButtonV2>
          </>
        ) : (
          <ButtonV2 className="login" onClick={onLogin}>
            <img
              src="https://img.icons8.com/color/48/undefined/google-logo.png"
              alt="google_icon"
            />
            <span>google 로그인</span>
          </ButtonV2>
        )}
      </ButtonsWrap>
    </HomeBodyWrap>
  ) : (
    <></>
  );
});

export default hot(HomePage);

const HomeBodyWrap = styled.div`
  width: 800px;

  margin: 0 auto;
  color: #303540;

  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 0 10px;
  }

  button {
    width: 200px;
    height: 80px;
    background-color: #ededed;
    border: none;
    box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
    font-size: 18px;
    color: #333;
  }

  button:hover {
    background-color: #d6d6d6 !important;
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .login {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 28px;
      margin-right: 8px;
    }
  }

  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 0 10px;
  }
`;

const Title = styled.h1`
  font-size: 40px;
  text-align: center;
  margin: 20vh 0 40px;
  color: #ededed;
  text-shadow: 0 5px 11px #00000030;
`;
