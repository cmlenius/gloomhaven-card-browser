import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";

import { getDefaultMonster, verifyQueryParam } from "../../../common/helpers";

const Home = () => {
  const router = useRouter();

  const game = verifyQueryParam(router.query.game, "gh");
  const monster = getDefaultMonster(game);

  useEffect(() => {
    if (!router || !router.query.game) return;
    if (monster === null) {
      router.push(`/gh/monsters/ancient-artillery`);
    } else {
      router.push(`/${router.query.game}/monsters/${monster}`);
    }
  }, [monster, router]);

  return (
    <Layout>
      <div className="toolbar">
        <div className="toolbar-inner"></div>
      </div>
    </Layout>
  );
};

export default Home;
