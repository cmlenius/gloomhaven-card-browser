import BRicon from "../public/icons/classes/BR.svg";
import CHicon from "../public/icons/classes/CH.svg";
import MTicon from "../public/icons/classes/MT.svg";
import SCicon from "../public/icons/classes/SC.svg";
import SWicon from "../public/icons/classes/SW.svg";
import TIicon from "../public/icons/classes/TI.svg";
import { colour } from "../data/common";

const iconMap = {
  BR: BRicon,
  CH: CHicon,
  MT: MTicon,
  SC: SCicon,
  SW: SWicon,
  TI: TIicon,
};

// TODO default icon
function SvgCharacterIcon({ character }) {
  const Icon = iconMap[character];

  return <Icon fill={colour(character)} height="24px" width="24px" />;
}

export default SvgCharacterIcon;
