import { useState, useEffect } from "react";
import { client } from "../sanityConfig.js";

async function getLeaderboard() {
  const leaderboard = await client.fetch('*[_type == "ambassador"]');
  return leaderboard;
}

export default function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  useEffect(() => {
    getLeaderboard().then((leaderboard) => {
      leaderboard.forEach((lb) => {
        lb.total_count = lb.ref_count + lb.share_score;
      });
      const sortedLeaderboard = leaderboard.sort((a, b) => b.total_count - a.total_count);
      setLeaderboard(sortedLeaderboard);
      setFilteredLeaderboard(sortedLeaderboard);
    });
  }, []);

  useEffect(() => {
    if (!leaderboard.length) return;
    const filteredLeaderboard = leaderboard.filter((lb) => {
      return lb.name.toLowerCase().includes(search.toLowerCase()) || lb.college.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredLeaderboard(filteredLeaderboard);
  }, [search]);

  return (
    <>
      <div className="font-odibee-sans h-full flex flex-col justify-center items-center gap-4 md:gap-12">
        <div className="flex flex-col items-center pt-4 sm:pt-24 gap-1 md:gap-4">
          <h2 className="text-3xl md:text-7xl font-medium text-white">Campus Ambassador</h2>
          <h2 className="text-xl md:text-6xl font-medium text-[#51A1AA]">Leaderboard</h2>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="w-5/6 h-12 md:h-20 rounded-lg text-black text-xl md:text-4xl pl-8" placeholder="Search College or Name" />
        <table className="table-auto text-white w-5/6">
          <thead>
            <tr className="text-sm md:text-4xl border-b">
              <th className="text-left pb-2 md:pb-4">Position</th>
              <th className="text-center pb-2 md:pb-4">Name</th>
              <th className="text-center pb-2 md:pb-4">College</th>
              <th className="text-right pb-2 md:pb-4">Score</th>
            </tr>
          </thead>
          <div className="w-full h-2 md:h-4"></div>
          <tbody className="bg-[#51A1AA17] rounded-lg backdrop-blur-lg" style={{ maxHeight: "300px", overflowY: "auto" }}>
            {filteredLeaderboard.map((lb, index) => (
              <tr className="text-xs md:text-2xl text-white" key={index + lb.name}>
                <td className="text-center py-4">{leaderboard.indexOf(lb) + 1}</td>
                <td className="text-center">{lb.name}</td>
                <td className="text-center">{lb.college}</td>
                <td className="text-center">{lb.total_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>

  )
}