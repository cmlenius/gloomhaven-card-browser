import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
  getBaseUrl,
  getCharacterClasses,
  getDefaultCharacterClass,
  getTitle,
  verifyQueryParam,
} from "../../../common/helpers";
import { Option } from "../../../common/types";
import Layout from "../../../components/Layout";
import Sort from "../../../components/Sort";

const sortOrderOptions: Option[] = [
  { id: "level", name: "Level" },
  { id: "initiative", name: "Initiative" },
  { id: "name", name: "Name" },
];

type ClassFilterProps = {
  game: string;
};

const ClassFilter = ({ game }: ClassFilterProps) => {
  return (
    <div className="filters">
      {getCharacterClasses(game)
        .filter((c) => !c.hidden)
        .map((char) => (
          <Link key={char.class} href={`/${game}/characters/${char.class}`}>
            <a className={`filter-icon`}>
              <img
                alt=""
                src={
                  getBaseUrl() + `icons/characters/${game}/${char.class}.png`
                }
              />
            </a>
          </Link>
        ))}
    </div>
  );
};

const Characters = () => {
  const router = useRouter();
  const game = verifyQueryParam(router.query.game, "gh");
  const characterClass = verifyQueryParam(
    router.query.character,
    getDefaultCharacterClass(game)
  );

  useEffect(() => {
    if (!router || !router?.query?.game) return;
    if (characterClass === null) {
      router.push(`/gh/characters/BR`);
    } else {
      router.push(`/${router.query.game}/characters/${characterClass}`);
    }
  }, [characterClass, router]);

  return (
    <Layout title={getTitle(game, "Characters")}>
      <div className="toolbar">
        <div className="toolbar-inner">
          <div>
            <div className="flex">
              <Sort pathname="characters" sortOrderOptions={sortOrderOptions} />
            </div>
          </div>
          <div />
          <div>
            <div className="button-group">
              <button disabled>Character Mat</button>
              <button disabled>Character Sheet</button>
            </div>
          </div>
        </div>
      </div>
      <ClassFilter game={game} />
    </Layout>
  );
};

export default Characters;
