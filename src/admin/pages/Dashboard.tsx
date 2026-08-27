import { useEffect, useState } from "react";

import StatCard from "../components/cards/StatCard";
import RecentMessages from "../components/cards/RecentMessages";
import QuickActions from "../components/cards/QuickActions";

import {
  getDashboardStats,
} from "../../services/dashboard.service";

import type {
  DashboardStats,
} from "../../services/dashboard.service";

export default function Dashboard() {

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  useEffect(() => {

    async function load() {

      const data =
        await getDashboardStats();

      setStats(data);

    }

    load();

  }, []);

  if (!stats)
    return <h2>Loading...</h2>;

  return (

    <>

      <h1>
        Dashboard
      </h1>

      <div
        style={{
          display:"grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap:24,
          marginTop:30,
        }}
      >

        <StatCard
          title="Projects"
          value={stats.projects}
        />

        <StatCard
          title="Skills"
          value={stats.skills}
        />

        <StatCard
          title="Roles"
          value={stats.roles}
        />

        <StatCard
          title="Certifications"
          value={stats.certifications}
        />

        <StatCard
          title="Messages"
          value={stats.messages}
        />

      </div>

        <QuickActions />
        
      <RecentMessages />


    </>

  );
}