import { useColorMode } from "../theme/color-mode";
import colors from "../theme/color";

export function useColorStyles() {
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";

  return {
    bgThird: isLight ? colors.light.bgThird : colors.dark.bgThird,
    bgFourth: isLight ? colors.light.bgFourth : colors.dark.bgFourth,
    bgInput: isLight ? colors.light.bgInput : colors.dark.bgInput,
    textMain: isLight ? colors.light.textMain : colors.dark.textMain,
    textSub: isLight ? colors.light.textSub : colors.dark.textSub,
    mainFixed: isLight ? colors.light.mainFixed : colors.dark.mainFixed,
    mainFixed10a: isLight ? colors.light.mainFixed10a : colors.dark.mainFixed10a,
    mainFixed70a: isLight ? colors.light.mainFixed70a : colors.dark.mainFixed70a,
    border1: isLight ? colors.light.border1 : colors.dark.border1,
    error: isLight ? colors.light.error : colors.dark.error,
    error10a: isLight ? colors.light.error10a : colors.dark.error10a,
    success: isLight ? colors.light.success : colors.dark.success,
    success20a: isLight ? colors.light.success20a : colors.dark.success20a,
    bgFixed: isLight ? colors.light.bgFixed : colors.dark.bgFixed,
    info10a: isLight ? colors.light.info10a : colors.dark.info10a,
    info: isLight ? colors.light.info : colors.dark.info,
  };
}
