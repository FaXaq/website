import { theme } from "@/components/ui/theme";
import { COLOR } from "./helpers/getNoteColor"

export const getColorString = ({ color }: { color: COLOR }) => {
  switch (color) {
  case COLOR.YELLOW:
    return theme.colors["mtts-yellow"];
  case COLOR.KHAKI:
    return theme.colors["mtts-khaki"];
  case COLOR.GREEN:
    return theme.colors["mtts-green"];
  case COLOR.BLUE:
    return theme.colors["mtts-blue"];
  case COLOR.VIOLET:
    return theme.colors["mtts-violet"];
  case COLOR.RED:
    return theme.colors["mtts-red"];
  }
  return theme.colors["mtts-cta-1"];
}