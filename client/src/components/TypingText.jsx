import { useEffect, useMemo, useState } from "react";

export default function TypingText({
  text,
  speed = 32,
  startDelay = 450,
  className = "",
  cursor = true,
  stopCursorOnDone = true,
  fadeIn = true,
}) {
  const full = useMemo(() => String(text || ""), [text]);
  const [out, setOut] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let tStart = null;
    let tType = null;

    setOut("");
    setStarted(false);
    setDone(false);

    tStart = setTimeout(() => {
      setStarted(true);
      tType = setInterval(() => {
        i += 1;
        setOut(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(tType);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      if (tStart) clearTimeout(tStart);
      if (tType) clearInterval(tType);
    };
  }, [full, speed, startDelay]);

  const showCursor = cursor && (!stopCursorOnDone || !done);

  return (
    <span className={[className, fadeIn && started ? "rt-fade-line" : ""].join(" ")}>
      {out}
      {showCursor ? <span className="rt-cursor">|</span> : null}
    </span>
  );
}