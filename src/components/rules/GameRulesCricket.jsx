import { useState } from "react";
import { RulesButton } from "./RulesButton";
import { LangSwitch, LangBtn, Intro, Section } from "./GameRules.styled";

const texts = {
  no: {
    title: "Cricket – Regler",
    intro:
      "Målet er å «lukke» alle valgte tall + bull. Dobbel teller 2 treff, trippel 3 treff. Førstemann som lukker alt vinner. Ingen poeng brukes i denne varianten.",
    sections: [
      {
        h: "Oppsett & tall",
        p: "Standard: 15–20 og bull. Variasjonene vi støtter: (1) 1–10 + bull, (2) Full game 1–20 + bull. Hvert mål lukkes ved totalt 3 treff (singel=1, dobbel=2, trippel=3). Ytre bull=25 (1), dobbel bull=50 (2).",
      },
      {
        h: "Tur & markering",
        p: "Tre piler per tur. Treff akkumuleres over tid. Første treff markeres '/', andre 'X', og tredje lukker feltet.",
      },
      {
        h: "Vinne",
        p: "Ingen poeng. Første spiller som lukker alle valgte tall og bull vinner umiddelbart.",
      },
      {
        h: "Varianter (valgbare)",
        p: "1–10 + bull (kort spill) og 1–20 + bull (fullt spill).",
      },
    ],
  },
  en: {
    title: "Cricket – Rules",
    intro:
      "Objective: close all selected numbers + bull. Doubles count as 2 marks, triples as 3. First to close everything wins. No points are used in this variant.",
    sections: [
      {
        h: "Setup & Numbers",
        p: "Default: 15–20 + bull. Variants we support: (1) 1–10 + bull, (2) Full game 1–20 + bull. Each target closes at 3 total marks (single=1, double=2, triple=3). Outer bull=25 (1), double bull=50 (2).",
      },
      {
        h: "Turns & Marks",
        p: "Three darts per turn. Marks accumulate across turns. First mark '/', second 'X', third closes the number.",
      },
      {
        h: "Winning",
        p: "No points. The first player to close all chosen numbers plus bull wins immediately.",
      },
      {
        h: "Variants (selectable)",
        p: "1–10 + bull (short game) and 1–20 + bull (full game).",
      },
    ],
  },
};

export function GameRulesCricket() {
  const [lang, setLang] = useState("no");
  const t = texts[lang];
  return (
    <RulesButton title={t.title}>
      <LangSwitch>
        <LangBtn onClick={() => setLang("no")} disabled={lang === "no"}>
          NO
        </LangBtn>
        <LangBtn onClick={() => setLang("en")} disabled={lang === "en"}>
          EN
        </LangBtn>
      </LangSwitch>
      <Intro>{t.intro}</Intro>
      {t.sections.map((s, i) => (
        <Section key={i}>
          <h4>{s.h}</h4>
          <p>{s.p}</p>
        </Section>
      ))}
    </RulesButton>
  );
}
