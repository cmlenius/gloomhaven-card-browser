import BRicon from "../public/icons/classes/BR.svg";
import CHicon from "../public/icons/classes/CH.svg";
import MTicon from "../public/icons/classes/MT.svg";
import SCicon from "../public/icons/classes/SC.svg";
import SWicon from "../public/icons/classes/SW.svg";
import TIicon from "../public/icons/classes/TI.svg";
import BEicon from "../public/icons/classes/BE.svg";
import BTicon from "../public/icons/classes/BT.svg";
import DSicon from "../public/icons/classes/DS.svg";
import ELicon from "../public/icons/classes/EL.svg";
import NSicon from "../public/icons/classes/NS.svg";
import PHicon from "../public/icons/classes/PH.svg";
import QMicon from "../public/icons/classes/QM.svg";
import SBicon from "../public/icons/classes/SB.svg";
import SKicon from "../public/icons/classes/SK.svg";
import SSicon from "../public/icons/classes/SS.svg";
import SUicon from "../public/icons/classes/SU.svg";
 
import DRicon from "../public/icons/classes/DR.svg";
 
 
import { colour } from "../data/common";

const iconMap = {
  BR: BRicon,
  CH: CHicon,
  MT: MTicon,
  SC: SCicon,
  SW: SWicon,
  TI: TIicon,
  BE: BEicon,
  BT: BTicon,
  DS: DSicon,
  EL: ELicon,
  NS: NSicon,
  PH: PHicon,
  QM: QMicon,
  SB: SBicon,
  SK: SKicon,
  SS: SSicon,
  SU: SUicon,
   
  // Forgotten Circles
  DR: DRicon,
};

// TODO default icon
function SvgCharacterIcon({ character }) {
  const Icon = iconMap[character];

  if (!Icon) return <div />;

  return <Icon fill={colour(character)} height="24px" width="24px" />;
}

export default SvgCharacterIcon;
