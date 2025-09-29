import { useState } from "react";
import { RulesButton } from "./RulesButton";
import { LangSwitch, LangBtn, Intro, Section } from "./GameRules.styled";

const texts = {
  en: {
    title: "Killer Rules",
    intro:
      "Each player is assigned a number. Earn up to 3 lives on your own number; at 3 lives you become a Killer and can take lives from others. Last player alive wins.",
    sections: [
      {
        h: "Setup",
        p: "Each player is given a unique number (1–20). Optional toggles: Double-in (off by default), Self-kill (on by default). Everyone starts at 0 lives.",
      },
      {
        h: "Gaining lives",
        p: "Hitting your own number adds lives: single=+1, double=+2, triple=+3. Lives cap at 3. If Double-in is ON you must first hit a double on your own number to start earning lives; otherwise singles also count.",
      },
      {
        h: "Becoming a Killer",
        p: "At 3 lives you are a Killer. Before you become a Killer, hitting your own number never removes your lives (even if the hit would overflow past 3).",
      },
      {
        h: "Taking lives",
        p: "As a Killer, hitting someone else’s number removes their lives by 1/2/3 for single/double/triple.",
      },
      {
        h: "Self-kill (optional)",
        p: "If Self-kill is ON and you are already a Killer, hitting your own number subtracts your lives by 1/2/3. If OFF, your own number never reduces your lives.",
      },
      {
        h: "Last chance at −1",
        p: "If you drop to −1 you have one round to recover: if during that round you do not hit your own number at least once, you become Dead (−2) at the end of your third dart.",
      },
      {
        h: "Elimination & win",
        p: "Dead is −2. When all but one are Dead, the remaining player wins.",
      },
    ],
  },
  no: {
    title: "Killer – Regler",
    intro:
      "Hver spiller får et tall. Samle opptil 3 liv på eget tall; med 3 liv blir du Killer og kan ta liv fra andre. Siste spiller i live vinner.",
    sections: [
      {
        h: "Oppsett",
        p: "Alle får hvert sitt tall (1–20). Valg: Double-in (av som standard), Self-kill (på som standard). Alle starter på 0 liv.",
      },
      {
        h: "Få liv",
        p: "Treff eget tall: singel=+1, dobbel=+2, trippel=+3. Liv stopper på maks 3. Med Double-in PÅ må du først treffe dobbel på eget tall for at liv skal telle; ellers teller også singel.",
      },
      {
        h: "Bli Killer",
        p: "På 3 liv er du Killer. Før du blir Killer kan du ikke skade deg selv ved å treffe eget tall, selv om kastet ville «gått over» 3.",
      },
      {
        h: "Ta liv",
        p: "Som Killer tar du liv fra andre ved å treffe tallet deres med 1/2/3 for singel/dobbel/trippel.",
      },
      {
        h: "Self-kill (valgfritt)",
        p: "Hvis Self-kill er PÅ og du allerede er Killer, så mister du 1/2/3 liv ved å treffe eget tall. Hvis AV, mister du aldri liv på eget tall.",
      },
      {
        h: "Siste sjanse på −1",
        p: "På −1 har du én runde på å redde deg: hvis du ikke treffer eget tall i løpet av runden, blir du Død (−2) ved slutten av tredje pil.",
      },
      {
        h: "Utslag & vinner",
        p: "Død er −2. Når alle unntatt én er Død, vinner den siste spilleren.",
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
