export const voiceSlice = (set) => ({
  ttsEnabled: true,
  ttsLang: "nb-NO",
  ttsVoiceURI: "",
  ttsVoiceName: "",
  ttsRate: 1,
  ttsPitch: 1,
  ttsVolume: 1,

  setTtsEnabled: (v) => set({ ttsEnabled: !!v }),
  setTtsLang: (lang) => set({ ttsLang: lang, ttsVoiceURI: "" }),
  setTtsVoiceURI: (uri) => set({ ttsVoiceURI: uri }),
  setTtsRate: (rate) => set({ ttsRate: rate }),
  setTtsPitch: (pitch) => set({ ttsPitch: pitch }),
  setTtsVolume: (volume) => set({ ttsVolume: volume }),
});
