import { Button, TextInput } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useLoginPageStores } from "./LoginPageProvider";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  width: 500px;
`;

const LoginPage = observer(() => {
  const { loginStore } = useLoginPageStores();
  const { setUsername, setPassword, login, username, password } = loginStore;

  const onChangeUsername = useCallback((id) => setUsername(id), [setUsername]);
  const onChangePassword = useCallback((pw) => setPassword(pw), [setPassword]);

  return (
    <Wrapper>
      <LoginBox>
        <h1>Login</h1>
        <div>
          <TextInput
            width="100%"
            label="Username"
            value={username}
            onChange={onChangeUsername}
          />
        </div>
        <div>
          <TextInput
            width="100%"
            marginTop="10px"
            label="Password"
            type="password"
            value={password}
            onChange={onChangePassword}
          />
        </div>
        <Button contained onClick={login} marginTop="10px" width="100%">
          Login
        </Button>
      </LoginBox>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </Wrapper>
  );
});

export default LoginPage;
