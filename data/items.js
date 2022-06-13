export const baseUrl =
  "https://raw.githubusercontent.com/cmlenius/gloomhaven-card-viewer/images/images/items/gloomhaven/";

export const sortDirectionOptions = [
  { id: "asc", name: "Asc" },
  { id: "desc", name: "Desc" },
];

export const sortOrderOptions = [
  { id: "id", name: "Item Number" },
  { id: "cost", name: "Cost" },
  { id: "slot", name: "Equipment Slot" },
  { id: "name", name: "Name" },
];

export function optionToLabel(id, options) {
  return options.find((option) => id == option.id)?.name || options[0].name;
}

export const slotFilters = [
  { id: "head", name: "Head", icon: "/icons/equipment/head.png" },
  { id: "body", name: "Body", icon: "/icons/equipment/body.png" },
  { id: "1h", name: "1 Hand", icon: "/icons/equipment/1h.png" },
  { id: "2h", name: "2 Hands", icon: "/icons/equipment/2h.png" },
  { id: "legs", name: "Legs", icon: "/icons/equipment/legs.png" },
  { id: "small", name: "Small Item", icon: "/icons/equipment/small.png" },
];
 
export const activationsFilters = [
  { id: "consumed", name: "Consumed", icon: "/icons/consumed.png" },
  { id: "spent", name: "Spent", icon: "/icons/spent.png" },
];

/* Filters
- Slot
- Spent
- Consumed
- Source
*/
