import {
  Button,
  SnackbarProps,
  SnackbarV2,
} from "@meshkorea/vroong-design-system-web";
import React, { useCallback, useState } from "react";
import { hot } from "react-hot-loader/root";
import { Link } from "react-router-dom";

import { useCore } from "core";

const HomePage = (args: SnackbarProps) => {
  const core = useCore();
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleSnackbarOpen = useCallback(() => {
    setIsToastOpen(true);
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setIsToastOpen(false);
  }, []);

  const handleAlertOpen = useCallback(() => {
    core.dialog.openAlert({
      title: "Alert!",
      message: "Alert은 이렇게 나옵니다.",
    });
  }, [core.dialog]);

  const handleSpinner = useCallback(() => {
    core.dialog.openSpinner();
    setTimeout(() => {
      core.dialog.closeSpinner();
    }, 1000);
  }, [core.dialog]);

  return (
    <div>
      <div>
        <h1>이곳은 홈페이지</h1>
        <Button onClick={handleAlertOpen}>Open alert</Button>
        <Button onClick={handleSpinner}>Open spinner</Button>
        <Button onClick={handleSnackbarOpen}>토스트 출력</Button>
        {isToastOpen ? (
          <SnackbarV2
            {...args}
            text="이미 만료된 투표입니다."
            onClose={handleSnackbarClose}
          />
        ) : null}
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default hot(HomePage);
