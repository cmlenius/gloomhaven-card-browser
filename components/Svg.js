import { colour } from "../data/common";

// Gloomhaven
import BR from "../public/icons/classes/gh/BR.svg";
import CH from "../public/icons/classes/gh/CH.svg";
import MT from "../public/icons/classes/gh/MT.svg";
import SC from "../public/icons/classes/gh/SC.svg";
import SW from "../public/icons/classes/gh/SW.svg";
import TI from "../public/icons/classes/gh/TI.svg";
import BE from "../public/icons/classes/gh/BE.svg";
import BT from "../public/icons/classes/gh/BT.svg";
import DS from "../public/icons/classes/gh/DS.svg";
import EL from "../public/icons/classes/gh/EL.svg";
import NS from "../public/icons/classes/gh/NS.svg";
import PH from "../public/icons/classes/gh/PH.svg";
import QM from "../public/icons/classes/gh/QM.svg";
import SB from "../public/icons/classes/gh/SB.svg";
import SK from "../public/icons/classes/gh/SK.svg";
import SS from "../public/icons/classes/gh/SS.svg";
import SU from "../public/icons/classes/gh/SU.svg";

// Forgotten Circles
import DR from "../public/icons/classes/fc/DR.svg";

// Jaws of the Lion
import DE from "../public/icons/classes/jotl/DE.svg";
import HA from "../public/icons/classes/jotl/HA.svg";
import RG from "../public/icons/classes/jotl/RG.svg";
import VW from "../public/icons/classes/jotl/VW.svg";

// Crimson Scales
import AA from "../public/icons/classes/cs/AA.svg";
import BK from "../public/icons/classes/cs/BK.svg";
import BM from "../public/icons/classes/cs/BM.svg";
import CG from "../public/icons/classes/cs/CG.svg";
import CT from "../public/icons/classes/cs/CT.svg";
import FK from "../public/icons/classes/cs/FK.svg";
import HO from "../public/icons/classes/cs/HO.svg";
import HP from "../public/icons/classes/cs/HP.svg";
import LU from "../public/icons/classes/cs/LU.svg";
import MF from "../public/icons/classes/cs/MF.svg";
import QA from "../public/icons/classes/cs/QA.svg";
import RM from "../public/icons/classes/cs/RM.svg";
import SP from "../public/icons/classes/cs/SP.svg";
import ST from "../public/icons/classes/cs/ST.svg";

const iconMap = {
  BR,
  CH,
  MT,
  SC,
  SW,
  TI,
  BE,
  BT,
  DS,
  EL,
  NS,
  PH,
  QM,
  SB,
  SK,
  SS,
  SU,

  // Forgotten Circles
  DR,

  // Jaws of the Lion
  DE,
  HA,
  RG,
  VW,

  // Crimson Scales
  AA,
  BK,
  BM,
  CG,
  CT,
  FK,
  HO,
  HP,
  LU,
  MF,
  QA,
  RM,
  SP,
  ST,
};

// TODO default icon
function SvgCharacterIcon({ character }) {
  const Icon = iconMap[character];

  if (!Icon) return <div />;

  return <Icon fill={colour(character)} height="24px" width="24px" />;
}

export default SvgCharacterIcon;
