import { useMemo } from "react";
import { useGameStore } from "../store";
import {
  Wrapper,
  SummaryGrid,
  StatBox,
  StatValue,
  StatLabel,
  Section,
  H2,
  H3,
  Table,
  THead,
  Th,
  TBody,
  Tr,
  Td,
} from "./StatsPage.styled";

const defaultX01 = {
  plays: 0,
  winsPerPlayer: {},
  playsPerPlayer: {},
  bestTurnPerPlayer: {},
  fewestDartsWinPerPlayer: {},
};
const defaultKiller = {
  plays: 0,
  winsPerPlayer: {},
  playsPerPlayer: {},
  mostKillsPerPlayer: {},
  totalKillsPerPlayer: {},
};
const defaultClock = {
  plays: 0,
  winsPerPlayer: {},
  playsPerPlayer: {},
  fastestPerPlayer: {},
};

function sumMaps(...maps) {
  const out = {};
  for (const m of maps) {
    for (const [k, v] of Object.entries(m || {})) {
      out[k] = (out[k] || 0) + v;
    }
  }
  return out;
}

function rowsFromPlaysWins(playsMap, winsMap) {
  const names = Object.keys({ ...playsMap, ...winsMap });
  return names
    .map((n) => ({
      player: n,
      plays: playsMap[n] || 0,
      wins: winsMap[n] || 0,
      winPct:
        (winsMap[n] || 0) + (playsMap[n] || 0) > 0
          ? (((winsMap[n] || 0) / (playsMap[n] || 0)) * 100).toFixed(1) + "%"
          : "0.0%",
    }))
    .sort(
      (a, b) =>
        parseFloat(b.winPct) - parseFloat(a.winPct) ||
        b.wins - a.wins ||
        b.plays - a.plays ||
        a.player.localeCompare(b.player)
    );
}

export default function StatsPage() {
  const stats = useGameStore((s) => s.stats);

  const g501 = stats?.byGame?.["501"] ?? defaultX01;
  const g301 = stats?.byGame?.["301"] ?? defaultX01;
  const killer = stats?.byGame?.killer ?? defaultKiller;
  const atc = stats?.byGame?.["clock"] ?? defaultClock;

  const rows501 = useMemo(() => {
    const base = rowsFromPlaysWins(g501.playsPerPlayer, g501.winsPerPlayer);
    return base.map((r) => ({
      ...r,
      bestTurn: g501.bestTurnPerPlayer[r.player] ?? "-",
      fewestDarts: g501.fewestDartsWinPerPlayer[r.player] ?? "-",
    }));
  }, [g501]);

  const rows301 = useMemo(() => {
    const base = rowsFromPlaysWins(g301.playsPerPlayer, g301.winsPerPlayer);
    return base.map((r) => ({
      ...r,
      bestTurn: g301.bestTurnPerPlayer[r.player] ?? "-",
      fewestDarts: g301.fewestDartsWinPerPlayer[r.player] ?? "-",
    }));
  }, [g301]);

  const rowsKiller = useMemo(() => {
    const base = rowsFromPlaysWins(killer.playsPerPlayer, killer.winsPerPlayer);
    return base.map((r) => ({
      ...r,
      bestKills: killer.mostKillsPerPlayer[r.player] || 0,
      totalKills: killer.totalKillsPerPlayer[r.player] || 0,
    }));
  }, [killer]);

  const rowsATC = useMemo(() => {
    const base = rowsFromPlaysWins(atc.playsPerPlayer, atc.winsPerPlayer);
    return base.map((r) => ({
      ...r,
      fastest: atc.fastestPerPlayer[r.player] ?? "-",
    }));
  }, [atc]);

  const overall = useMemo(() => {
    const plays = sumMaps(
      g501.playsPerPlayer,
      g301.playsPerPlayer,
      killer.playsPerPlayer,
      atc.playsPerPlayer
    );
    const wins = sumMaps(
      g501.winsPerPlayer,
      g301.winsPerPlayer,
      killer.winsPerPlayer,
      atc.winsPerPlayer
    );
    return rowsFromPlaysWins(plays, wins);
  }, [g501, g301, killer, atc]);

  return (
    <Wrapper>
      <H2>Stats</H2>

      <SummaryGrid>
        <StatBox>
          <StatValue>{stats.totalPlays}</StatValue>
          <StatLabel>Totalt antall spill</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{g501.plays}</StatValue>
          <StatLabel>501 spill</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{g301.plays}</StatValue>
          <StatLabel>301 spill</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{killer.plays}</StatValue>
          <StatLabel>Killer spill</StatLabel>
        </StatBox>
        <StatBox>
          <StatValue>{atc.plays}</StatValue>
          <StatLabel>Around the Clock spill</StatLabel>
        </StatBox>
      </SummaryGrid>

      <Section>
        <H3>Overall</H3>
        <Table>
          <THead>
            <Tr>
              <Th>Spiller</Th>
              <Th>Plays</Th>
              <Th>Wins</Th>
              <Th>Win%</Th>
            </Tr>
          </THead>
          <TBody>
            {overall.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{r.winPct}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Section>

      <Section>
        <H3>501</H3>
        <Table>
          <THead>
            <Tr>
              <Th>Spiller</Th>
              <Th>Plays</Th>
              <Th>Wins</Th>
              <Th>Win%</Th>
              <Th>Best Turn</Th>
              <Th>Fewest Darts</Th>
            </Tr>
          </THead>
          <TBody>
            {rows501.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{r.winPct}</Td>
                <Td>{r.bestTurn}</Td>
                <Td>{r.fewestDarts}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Section>

      <Section>
        <H3>301</H3>
        <Table>
          <THead>
            <Tr>
              <Th>Spiller</Th>
              <Th>Plays</Th>
              <Th>Wins</Th>
              <Th>Win%</Th>
              <Th>Best Turn</Th>
              <Th>Fewest Darts</Th>
            </Tr>
          </THead>
          <TBody>
            {rows301.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{r.winPct}</Td>
                <Td>{r.bestTurn}</Td>
                <Td>{r.fewestDarts}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Section>

      <Section>
        <H3>Killer</H3>
        <Table>
          <THead>
            <Tr>
              <Th>Spiller</Th>
              <Th>Plays</Th>
              <Th>Wins</Th>
              <Th>Win%</Th>
              <Th>Best Kills</Th>
              <Th>Total Kills</Th>
            </Tr>
          </THead>
          <TBody>
            {rowsKiller.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{r.winPct}</Td>
                <Td>{r.bestKills}</Td>
                <Td>{r.totalKills}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Section>

      <Section>
        <H3>Around the Clock</H3>
        <Table>
          <THead>
            <Tr>
              <Th>Spiller</Th>
              <Th>Plays</Th>
              <Th>Wins</Th>
              <Th>Win%</Th>
              <Th>Raskest (darts)</Th>
            </Tr>
          </THead>
          <TBody>
            {rowsATC.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{r.winPct}</Td>
                <Td>{r.fastest}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Section>
    </Wrapper>
  );
}
