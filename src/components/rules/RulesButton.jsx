import { useState } from "react";
import { Btn, Sheet, Head, Close, Body } from "./RulesButton.styled";

export function RulesButton({ title = "Rules", children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Btn onClick={() => setOpen(true)} aria-expanded={open} title="Show rules">ℹ️</Btn>
      {open && (
        <Sheet role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Head>
              <h3>{title}</h3>
              <Close onClick={() => setOpen(false)}>✕</Close>
            </Head>
            <Body>{children}</Body>
          </div>
        </Sheet>
      )}
    </>
  );
}
