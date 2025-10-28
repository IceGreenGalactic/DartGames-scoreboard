import { useState } from "react";
import { RulesButton } from "./RulesButton";
import { LangSwitch, LangBtn, Intro, Section } from "./GameRules.styled";

const texts = {
  no: {
    title: "Around the Clock Regler",
    intro:
      "Spillet går ut på å treffe tallene i rekkefølge fra 1 til 20, deretter dobbel, trippel og til slutt 3 ganger bull.",
    sections: [
      {
        h: "Rekkefølge",
        p: "Du må treffe tallene i riktig rekkefølge. Får du for eksempel 1, 3, 2 – teller du bare opp til 2, ikke 4.",
      },
      {
        h: "Tallene 1–20",
        p: "Start på 1 og treff tallet du står på for å gå videre. Dobbel eller trippel hopper deg videre flere steg, men du kan aldri gå høyere enn 20. (Dobbel 11 teller som 11, ikke 22.)",
      },
      {
        h: "Etter 20",
        p: "Når du har truffet 20, må du treffe en hvilken som helst dobbel, deretter en hvilken som helst trippel, og til slutt bull tre ganger for å vinne.",
      },
      {
        h: "Bull",
        p: "En vanlig bull teller som 1 bull. En dobbel bull teller som 2 bull. Trippel bull finnes ikke.",
      },
      {
        h: "Runder",
        p: "Du har tre piler per runde. Du kan treffe hva som helst, men bare riktige treff teller for å gå videre.",
      },
    ],
  },
  en: {
    title: "Around the Clock Rules",
    intro:
      "Hit the numbers in order from 1 to 20, then a double, a triple, and finally the bull three times to win.",
    sections: [
      {
        h: "Order",
        p: "You must hit the numbers in the correct order. If you hit 1, 3, 2 – you only reach 2, not 4.",
      },
      {
        h: "Numbers 1–20",
        p: "Start at 1 and hit your current number to move on. A double or triple skips ahead more steps, but you can never go past 20. (Double 11 counts as 11, not 22.)",
      },
      {
        h: "After 20",
        p: "After 20 you must hit any double, then any triple, and finally the bull three times to win.",
      },
      {
        h: "Bull",
        p: "A single bull counts as 1 bull. A double bull counts as 2 bulls. Triple bull does not exist.",
      },
      {
        h: "Turns",
        p: "You get three darts per turn. You can hit anything, but only correct hits advance your progress.",
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
