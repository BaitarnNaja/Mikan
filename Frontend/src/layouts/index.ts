import LayoutClassic from "./LayoutClassic";
import LayoutModern from "./LayoutModern";

export const LAYOUTS = {
  layout1: LayoutClassic,
  layout2: LayoutModern,
};

export type LayoutKey = keyof typeof LAYOUTS;