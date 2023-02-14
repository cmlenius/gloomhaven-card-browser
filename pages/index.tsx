import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/gh/characters/BR");
  }, [router]);

  return <Layout />;
};

export default Home;
