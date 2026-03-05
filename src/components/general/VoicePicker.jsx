import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../../store";
import { speak, ttsUnlock } from "../../store/lib/sfx";
import {
  Wrap,
  HeaderButton,
  HeaderLeft,
  HeaderTitle,
  HeaderMeta,
  Body,
  Row,
  LabelRow,
  Select,
  BtnRow,
  Hint,
  SmallHint,
  Pill,
} from "./VoicePicker.styled";

export function VoicePicker() {
  const ttsEnabled = useGameStore((s) => s.ttsEnabled);
  const ttsLang = useGameStore((s) => s.ttsLang);
  const ttsVoiceURI = useGameStore((s) => s.ttsVoiceURI);

  const setTtsEnabled = useGameStore((s) => s.setTtsEnabled);
  const setTtsLang = useGameStore((s) => s.setTtsLang);
  const setTtsVoiceURI = useGameStore((s) => s.setTtsVoiceURI);

  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices() || []);
    load();

    const t1 = setTimeout(load, 200);
    const t2 = setTimeout(load, 800);

    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const langs = useMemo(() => {
    const set = new Set(voices.map((v) => v.lang).filter(Boolean));
    const arr = Array.from(set).sort((a, b) =>
      a === "nb-NO" ? -1 : b === "nb-NO" ? 1 : a.localeCompare(b),
    );
    return arr.length ? arr : ["nb-NO", "en-GB", "en-US"];
  }, [voices]);

  const voicesForLang = useMemo(() => {
    const base = (ttsLang || "").split("-")[0];
    return voices.filter((v) => v.lang === ttsLang || v.lang?.startsWith(base));
  }, [voices, ttsLang]);

  useEffect(() => {
    if (!ttsVoiceURI) return;
    if (!voices || voices.length === 0) return;

    const stillExists = voices.some((v) => v.voiceURI === ttsVoiceURI);
    if (!stillExists) setTtsVoiceURI("");
  }, [voices, ttsVoiceURI, setTtsVoiceURI]);

  const fewVoicesHint =
    ttsEnabled && voices.length > 0 && voicesForLang.length <= 1;

  const currentVoiceLabel = useMemo(() => {
    if (!ttsVoiceURI) return "Auto";
    const v = voices.find((x) => x.voiceURI === ttsVoiceURI);
    return v?.name || "Auto";
  }, [ttsVoiceURI, voices]);

  function toast(msg) {
    setToastMsg(msg);
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => setToastMsg(""), 1800);
  }

  return (
    <Wrap>
      <HeaderButton
        type="button"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((x) => !x)}
      >
        <HeaderLeft>
          <HeaderTitle>Velg stemme</HeaderTitle>
          <HeaderMeta>
            {ttsEnabled ? ttsLang || "nb-NO" : "TTS av"} • Stemme i bruk:{" "}
            {currentVoiceLabel}
          </HeaderMeta>
        </HeaderLeft>

        <Pill data-on={ttsEnabled ? "1" : "0"}>{ttsEnabled ? "På" : "Av"}</Pill>
      </HeaderButton>

      {open && (
        <Body>
          <Row>
            <LabelRow>
              <input
                type="checkbox"
                checked={!!ttsEnabled}
                onChange={(e) => {
                  const v = e.target.checked;
                  setTtsEnabled(v);
                  if (v) ttsUnlock();
                }}
              />
              <span>TTS (si poeng)</span>
            </LabelRow>
          </Row>

          <Row>
            <label>Språk</label>
            <Select
              value={ttsLang || "nb-NO"}
              onChange={(e) => {
                ttsUnlock();
                setTtsLang(e.target.value);
                setTtsVoiceURI("");
                toast("Språk oppdatert");
              }}
              disabled={!ttsEnabled}
            >
              {langs.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Row>

          <Row>
            <label>Stemme</label>
            <Select
              value={ttsVoiceURI || ""}
              onChange={(e) => {
                ttsUnlock();
                const uri = e.target.value || "";
                const v = voices.find((x) => x.voiceURI === uri);
                setTtsVoiceURI(uri);
                toast("Stemme valgt ✅");
              }}
              disabled={!ttsEnabled}
            >
              <option value="">Auto (beste match)</option>
              {voicesForLang.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                  {v.default ? " (default)" : ""}
                </option>
              ))}
            </Select>

            <BtnRow>
              <button
                className="btn btn-outline-light"
                disabled={!ttsEnabled}
                onClick={() => {
                  ttsUnlock();
                  speak("1, 10, 54");
                }}
              >
                Test
              </button>

              <button
                className="btn btn-outline-light"
                disabled={!ttsEnabled || !ttsVoiceURI}
                onClick={() => {
                  ttsUnlock();
                  setTtsVoiceURI("");
                  toast("Bruker Auto ✅");
                }}
              >
                Tilbakestill til Auto
              </button>
            </BtnRow>

            {toastMsg ? (
              <Hint>
                Stemme i bruk: <b>{currentVoiceLabel}</b>
                <br />
                {toastMsg}
              </Hint>
            ) : (
              <Hint>
                Stemme i bruk: <b>{currentVoiceLabel}</b>
              </Hint>
            )}

            {fewVoicesHint && (
              <Hint>
                Få stemmer tilgjengelig for {ttsLang} på denne enheten.
                <br />
                Installer flere stemmer i systeminnstillinger (Tale /
                Text-to-speech).
              </Hint>
            )}

            <SmallHint>
              Tips: Stemmer varierer mellom mobil/desktop. iOS Safari har ofte
              færre valg.
            </SmallHint>
          </Row>
        </Body>
      )}
    </Wrap>
  );
}
