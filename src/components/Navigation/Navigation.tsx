import { IconV2 } from "@meshkorea/vroong-design-system-web";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Navigation = () => {
  const location = useLocation();

  return (
    location.pathname !== "/home" && (
      <NavWraper>
        <Link to="/home">
          <IconV2 name="HOME" color="#fff" />
        </Link>
      </NavWraper>
    )
  );
};

export default Navigation;

const NavWraper = styled.nav`
  position: fixed;
  top: 14px;
  left: 14px;

  a {
    svg {
      width: 40px;
      height: 40px;
    }
  }

  @media screen and (max-width: 600px) {
    top: 8px;
    left: 8px;

    a {
      svg {
        width: 32px;
        height: 32px;
      }
    }
  }
`;
