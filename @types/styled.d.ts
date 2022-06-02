import { ThemeInterface } from "@meshkorea/vroong-design-system-web";

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeInterface {}
}
