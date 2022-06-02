import { foundations, globalStyle } from "@meshkorea/vroong-design-system-web";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  ${globalStyle()}

  html,
  body {
    font-family: ${foundations.typography.fontFamily};
  }

  button,
  input,
  select,
  textarea {
    font-family: ${foundations.typography.fontFamily};
  }
`;

export default GlobalStyle;
