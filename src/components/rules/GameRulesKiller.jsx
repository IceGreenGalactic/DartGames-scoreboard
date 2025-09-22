import { useState } from "react";
import { RulesButton } from "./RulesButton";
import { LangSwitch, LangBtn, Intro, Section } from "./GameRules.styled";

const texts = {
  en: {
    title: "Killer Rules",
    intro: "Each player has a target number and lives.",
    sections: [
      { h: "Become Killer", p: "Hit your number to become a Killer." },
      {
        h: "Attack",
        p: "As Killer, hit others’ numbers to remove lives. Last alive wins.",
      },
    ],
  },
  no: {
    title: "Killer Regler",
    intro: "Hver spiller har et måltall og liv.",
    sections: [
      { h: "Bli Killer", p: "Treff ditt tall for å bli Killer." },
      {
        h: "Angrip",
        p: "Som Killer, treff andres tall for å fjerne liv. Siste som står vinner.",
      },
    ],
  },
};

export function GameRulesKiller() {
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
