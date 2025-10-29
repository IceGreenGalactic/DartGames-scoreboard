import { useState } from "react";
import { RulesButton } from "./RulesButton";
import { LangSwitch, LangBtn, Intro, Section } from "./GameRules.styled";

const texts = {
  en: {
    title: "301 Rules",
    intro: "Start at 301. Three darts per turn.",
    sections: [
      {
        h: "How to Start",
        p: "Closest to bull starts. Optional: 'double in' must hit a double before scoring.",
      },
      {
        h: "Scoring",
        p: "Subtract from 301. Singles=face value, doubles×2, triples×3. Bull 25, double bull 50.",
      },
      {
        h: "Winning",
        p: "Finish on exactly 0 with a double. Bust (<0, 1 left, or 0 without double) resets to start-of-turn.",
      },
      {
        h: "Tips",
        p: "Aim T20, learn checkouts, keep steady rhythm, stay calm.",
      },
    ],
  },
  no: {
    title: "301 Regler",
    intro: "Start på 301. Tre piler per runde.",
    sections: [
      {
        h: "Start",
        p: "Nærmest bull starter. Valgfritt: 'double in' – treff dobbel før poeng teller.",
      },
      {
        h: "Scoring",
        p: "Trekk fra 301. Single=verdi, dobbel×2, trippel×3. Bull 25, dobbel bull 50.",
      },
      {
        h: "Vinne",
        p: "Må ende på 0 med dobbel. Bust (<0, 1 igjen, eller 0 uten dobbel) tilbakestiller til start av runden.",
      },
      {
        h: "Tips",
        p: "Sikt T20, lær checkouts, hold jevn rytme, behold roen.",
      },
    ],
  },
};

export function GameRules301() {
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
