import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

import {
  getDefaultCharacterClass,
  verifyQueryParam,
} from "../../common/helpers";

const Home = () => {
  const router = useRouter();

  const game = verifyQueryParam(router.query.game, "gh");
  const characterClass = getDefaultCharacterClass(game);

  useEffect(() => {
    if (!router || !router.query.game) return;
    if (characterClass === null) {
      router.push(`/gh/characters/BR`);
    } else {
      router.push(`/${router.query.game}/characters/${characterClass}`);
    }
  }, [characterClass, router]);

  return <Layout />;
};

export default Home;
