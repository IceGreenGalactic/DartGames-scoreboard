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
    .map((n) => ({ player: n, plays: playsMap[n] || 0, wins: winsMap[n] || 0 }))
    .sort(
      (a, b) =>
        b.wins - a.wins || b.plays - a.plays || a.player.localeCompare(b.player)
    );
}

export default function StatsPage() {
  const stats = useGameStore((s) => s.stats);

  const g501 = stats.byGame["501"];
  const killer = stats.byGame.killer;
  const atc = stats.byGame["around-the-clock"];

  const rows501 = useMemo(
    () => rowsFromPlaysWins(g501.playsPerPlayer, g501.winsPerPlayer),
    [g501]
  );
  const rowsKiller = useMemo(
    () => rowsFromPlaysWins(killer.playsPerPlayer, killer.winsPerPlayer),
    [killer]
  );
  const rowsATC = useMemo(() => {
    const base = rowsFromPlaysWins(atc.playsPerPlayer, atc.winsPerPlayer);
    return base.map((r) => ({
      ...r,
      fastest: atc.fastestPerPlayer[r.player] ?? null,
    }));
  }, [atc]);

  const overall = useMemo(() => {
    const plays = sumMaps(
      g501.playsPerPlayer,
      killer.playsPerPlayer,
      atc.playsPerPlayer
    );
    const wins = sumMaps(
      g501.winsPerPlayer,
      killer.winsPerPlayer,
      atc.winsPerPlayer
    );
    return rowsFromPlaysWins(plays, wins);
  }, [g501, killer, atc]);

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
            </Tr>
          </THead>
          <TBody>
            {overall.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
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
            </Tr>
          </THead>
          <TBody>
            {rows501.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
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
              <Th>Best Kills</Th>
            </Tr>
          </THead>
          <TBody>
            {rowsKiller.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{killer.mostKillsPerPlayer[r.player] || 0}</Td>
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
              <Th>Raskest (darts)</Th>
            </Tr>
          </THead>
          <TBody>
            {rowsATC.map((r) => (
              <Tr key={r.player}>
                <Td>{r.player}</Td>
                <Td>{r.plays}</Td>
                <Td>{r.wins}</Td>
                <Td>{r.fastest ?? "-"}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </Section>
    </Wrapper>
  );
}
