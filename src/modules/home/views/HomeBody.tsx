import { ButtonV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useCallback, useState } from "react";
import Lottie from "react-lottie-player";
import { useHistory } from "react-router";
import styled from "styled-components";

import { useCore } from "core";

import rouletteAnimation from "../../../assets/lottie/roulette-animation2.json";
import voteAnimation from "../../../assets/lottie/vote-animation.json";

const HomeBody = observer(() => {
  const core = useCore();
  const { isLoggedIn, user, logout } = core.googleAuth;
  const history = useHistory();
  const [voteAnimeStart, setVoteAnimeStart] = useState(false);
  const [rouletteAnimeStart, setRouletteAnimeStart] = useState(false);

  const onLogin = useCallback(() => {
    core.googleAuth.googleLogin();
  }, [core.googleAuth]);

  return (
    <HomeBodyWrap>
      <Title>Mesh Draw</Title>
      {isLoggedIn && (
        <UserTitle>
          <h2>{user?.displayName}님 환영합니다</h2>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </UserTitle>
      )}
      <ButtonsWrap>
        {isLoggedIn ? (
          <>
            <LottieWrap
              onMouseEnter={() => {
                setVoteAnimeStart(true);
              }}
              onMouseLeave={() => {
                setVoteAnimeStart(false);
              }}
            >
              <ButtonV2
                onClick={() => {
                  history.push("/vote");
                }}
              >
                <Lottie
                  className="lottie"
                  play={voteAnimeStart}
                  speed={0.9}
                  animationData={voteAnimation}
                  style={{ width: 180, height: 180 }}
                />
                <span>투표하기</span>
              </ButtonV2>
            </LottieWrap>
            <LottieWrap
              onMouseEnter={() => {
                setRouletteAnimeStart(true);
              }}
              onMouseLeave={() => {
                setRouletteAnimeStart(false);
              }}
            >
              <ButtonV2
                onClick={() => {
                  history.push("/roulette");
                }}
              >
                <Lottie
                  className="lottie"
                  play={rouletteAnimeStart}
                  speed={0.9}
                  animationData={rouletteAnimation}
                  style={{
                    width: 180,
                    height: 180,
                    paddingBottom: 50,
                  }}
                />
                <span>돌림판</span>
              </ButtonV2>
            </LottieWrap>
          </>
        ) : (
          <ButtonV2 className="login" onClick={onLogin} style={{ height: 60 }}>
            <img
              src="https://img.icons8.com/color/48/undefined/google-logo.png"
              alt="google_icon"
            />
            <span>google 로그인</span>
          </ButtonV2>
        )}
      </ButtonsWrap>
    </HomeBodyWrap>
  );
});

export default HomeBody;

const HomeBodyWrap = styled.div`
  width: 800px;

  margin: 0 auto;
  color: #303540;

  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 0 10px;
  }
`;

const ButtonsWrap = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 10px;
  margin-top: 50px;

  button {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 220px;
    padding: 0;
    background-color: #ededed;
    border: none;
    box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
    font-size: 18px;
    color: #444;

    .lottie {
      position: absolute;
      top: 50;
    }

    span {
      padding-top: 150px;
    }
  }

  button:hover {
    background-color: #d6d6d6 !important;
  }

  .login {
    flex-direction: row;

    img {
      width: 28px;
      margin-right: 8px;
    }

    span {
      padding: 0;
    }
  }
`;

const LottieWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 40px;
  text-align: center;
  margin: 20vh 0 0;
  color: #ededed;
  text-shadow: 0 5px 11px #00000030;
`;

const UserTitle = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0 0;

  h2 {
    font-size: 26px;
    margin: 0;
    color: #ededed;
    text-shadow: 0 5px 11px #00000030;
  }

  button {
    height: 42px;
    margin-left: 12px;
    color: #c73b3b;
    border: none;
    outline: none;
  }
  button:hover {
    color: #d05b5b;
  }
`;
