import { useState } from "react";
import { RulesButton } from "./RulesButton";
import { LangSwitch, LangBtn, Intro, Section } from "./GameRules.styled";

const texts = {
  en: {
    title: "Around the Clock Rules",
    intro: "Hit numbers in order: 1→20, then Bull.",
    sections: [
      {
        h: "Progress",
        p: "Single advances by 1 number, double by 2, triple by 3. Finish on Bull.",
      },
      {
        h: "Turns",
        p: "Three darts per turn. Next target is your current number + advance.",
      },
    ],
  },
  no: {
    title: "Around the Clock Regler",
    intro: "Treff tall i rekkefølge: 1→20, deretter Bull.",
    sections: [
      {
        h: "Fremdrift",
        p: "Single går +1, dobbel +2, trippel +3. Avslutt på Bull.",
      },
      {
        h: "Runder",
        p: "Tre piler per runde. Neste mål er nåværende tall + fremdrift.",
      },
    ],
  },
};

export function GameRulesClock() {
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
