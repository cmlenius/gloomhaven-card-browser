import { useEffect, useRef } from "react";
import { getBaseUrl } from "../common/utils";
import { EnhancementData } from "../hooks/useCraftingStore";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    height: "100vh",
  },
  text: {
    padding: "40px",
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 999,
  },
  modal: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: "12px",
    borderRadius: "12px",
    display: "grid",
    maxWidth: "92px",
    gridTemplateColumns: "repeat(auto-fit, minmax(20px, 1fr))",
    gap: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: "20px",
    height: "20px",
    objectFit: "contain",
    borderRadius: "6px",
  },
  label: {
    marginTop: "4px",
    fontSize: "14px",
  },
};

export type EnhancementCost = {
  id: string;
  cost: number;
};

const listGloomhavenEnhancements = (data: EnhancementData): EnhancementCost[] => {
    const enhancements: EnhancementCost[] = [];

    if ('plus1' in data.dot) {
      const plus1 = data.dot.plus1;
      const cost = {
        move: 30,
        attack: 50,
        range: 30,
        target: 50,
        shield: 100,
        retaliate: 100,
        pierce: 30,
        heal: 30,
        push: 30,
        pull: 30,
        'summon-hp': 50,
        'summon-move': 100,
        'summon-attack': 100,
        'summon-range': 50,
      }[plus1];
      if (cost) {
        enhancements.push(
          {
            id: 'plus1', cost,
          },
        );
        if (plus1 == 'move') {
          enhancements.push(
            { id: 'jump', cost: 50, },
          );
        }
      } else {
        console.log(plus1);
      }
    }
    if (data.dot.dot == 'circle' || data.dot.dot == 'diamond' || data.dot.dot == 'diamond-plus') {
      enhancements.push(
        { id: 'element-air', cost: 100, },
        { id: 'element-light', cost: 100, },
        { id: 'element-ice', cost: 100, },
        { id: 'element-dark', cost: 100, },
        { id: 'element-fire', cost: 100, },
        { id: 'element-earth', cost: 100, },
        { id: 'element-wild', cost: 150, },
      );
    }
    if (data.dot.dot == 'diamond') {
      enhancements.push(
        { id: 'condition-wound', cost: 75, },
        { id: 'condition-poison', cost: 75, },
        { id: 'condition-immobilize', cost: 100, },
        { id: 'condition-disarm', cost: 150, },
        { id: 'condition-muddle', cost: 50, },
        { id: 'condition-curse', cost: 150, },
      );
    }
    if (data.dot.dot == 'diamond-plus') {
      enhancements.push(
        { id: 'condition-strengthen', cost: 50, },
        { id: 'condition-bless', cost: 50, },
      );
    }
    if (data.dot.dot == 'hex') {
      enhancements.push(
        { id: 'hex', cost: 200 / data.dot.hexes, },
      );
    }

    const multiTargetModifier = data.dot.dot != 'hex' && data.dot.multitarget ? 2 : 1;
    const levelModifier = (data.level - 1) * 25;

    return enhancements.map(e => ({
      id: e.id,
      cost: Math.floor(e.cost * multiTargetModifier) + levelModifier,
    }));
}

const listFrosthavenEnhancements = (data: EnhancementData): EnhancementCost[] => {
    const enhancements: EnhancementCost[] = [];

    if ('plus1' in data.dot) {
      const plus1 = data.dot.plus1;
      const cost = {
        move: 30,
        attack: 50,
        range: 30,
        target: 75,
        shield: 80,
        retaliate: 60,
        pierce: 30,
        heal: 30,
        push: 30,
        pull: 20,
        teleport: 50,
        'summon-hp': 40,
        'summon-move': 60,
        'summon-attack': 100,
        'summon-range': 50,
        'other-move': 30,
      }[plus1];
      if (cost) {
        enhancements.push(
          {
            id: 'plus1', cost,
          },
        );
        if (plus1 == 'move') {
          enhancements.push(
            { id: 'jump', cost: 60, },
          );
        }
      } else {
        console.log(plus1);
      }
    }
    if (data.dot.dot == 'circle' || data.dot.dot == 'diamond' || data.dot.dot == 'diamond-plus') {
      enhancements.push(
        { id: 'element-air', cost: 100, },
        { id: 'element-light', cost: 100, },
        { id: 'element-ice', cost: 100, },
        { id: 'element-dark', cost: 100, },
        { id: 'element-fire', cost: 100, },
        { id: 'element-earth', cost: 100, },
        { id: 'element-wild', cost: 150, },
      );
    }
    if (data.dot.dot == 'diamond') {
      enhancements.push(
        { id: 'condition-wound', cost: 75, },
        { id: 'condition-poison', cost: 50, },
        { id: 'condition-immobilize', cost: 150, },
        { id: 'condition-muddle', cost: 40, },
        { id: 'condition-curse', cost: 150, },
      );
    }
    if (data.dot.dot == 'diamond-plus') {
      enhancements.push(
        { id: 'condition-regenerate', cost: 40, },
        { id: 'condition-ward', cost: 75, },
        { id: 'condition-strengthen', cost: 100, },
        { id: 'condition-bless', cost: 75, },
      );
    }
    if (data.dot.dot == 'hex') {
      enhancements.push(
        { id: 'hex', cost: 200 / data.dot.hexes, },
      );
    }

    const multiTargetModifier = data.dot.dot != 'hex' && data.dot.multitarget ? 2 : 1;
    const lossModifier = data.loss && !data.dot.persistent ? 0.5 : 1;
    const persistentModifier = data.dot.persistent ? 3 : 1;
    const modifier = multiTargetModifier * lossModifier * persistentModifier;

    const enhancerBuilding = 1;
    const levelModifier = (data.level - 1) * (enhancerBuilding >= 3 ? 15 : 25);
    const buildingModifier = enhancerBuilding >= 2 ? -10 : 0;

    return enhancements.map(e => ({
      id: e.id,
      cost: Math.ceil(e.cost * modifier) + levelModifier + buildingModifier,
    }));
}

const listEnhancements = (data: EnhancementData): EnhancementCost[] => {
  if (data.game == 'gh') {
    return listGloomhavenEnhancements(data)
  } else if (data.game == 'fh') {
    return listFrosthavenEnhancements(data)
  }
  return [];
}

export type EnhancementModalProps = {
  data: EnhancementData,
  onClick: (enhancement: string | null) => void;
  onClose: () => void;
};

export default function EnhancementModal({
  data,
  onClick,
  onClose,
}: EnhancementModalProps) {
  const enhancements = listEnhancements(data);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getBaseUrl = () => {
    return '/images/'
  }
  return (
    <div
      ref={ref}
      style={{
        ...styles.modal,
        top: data.y + 10,
        left: data.x + 10,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {enhancements.map((enhancement) => (
        <div key={enhancement.id} style={styles.item}>
          <img
            src={`${getBaseUrl()}enhancements/${enhancement.id}.png`}
            alt={`${enhancement.id}`}
            style={styles.image}
            onClick={() => onClick(enhancement.id)}
          />
          <span style={styles.label}>{enhancement.cost}g</span>
        </div>
      ))}
    </div>
  );
}
