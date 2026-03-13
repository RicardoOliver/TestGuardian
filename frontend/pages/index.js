import Head from "next/head";
import DashboardPage from "../components/DashboardPage";
import { getDashboardData } from "../lib/api";

export default function HomePage(props) {
  return (
    <>
      <Head>
        <title>TestGuardian Dashboard</title>
        <meta name="description" content="QAOps quality intelligence dashboard" />
      </Head>
      <DashboardPage {...props} />
    </>
  );
}

export async function getServerSideProps() {
  const data = await getDashboardData();
  return { props: data };
}
