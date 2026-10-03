import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0d12";
const SURFACE = "#141920";
const LINE = "#27303a";
const INK = "#eef1f5";
const MUTED = "#9ba6b3";

// The OG renderer can't read variable or woff2 fonts, so this uses Geist's
// static TTFs rather than the app's Bricolage display face.
const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");
const bold = readFile(join(fontDir, "Geist-Bold.ttf"));
const regular = readFile(join(fontDir, "Geist-Regular.ttf"));

/** The header mark: a rounded square with two filled slots and one open. */
function Mark({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" rx="8" stroke={INK} strokeWidth="1.6" />
      <circle cx="8.5" cy="14" r="2.5" fill={INK} />
      <circle cx="14" cy="14" r="2.5" fill={INK} />
      <circle cx="19.5" cy="14" r="2.5" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

function Slot({ n, live }: { n: string; live: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: 200,
        height: 120,
        padding: 22,
        borderRadius: 22,
        background: live ? SURFACE : "transparent",
        border: `2px ${live ? "solid" : "dashed"} ${LINE}`,
      }}
    >
      <div style={{ fontSize: 22, color: MUTED }}>{n}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, color: live ? INK : MUTED }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: live ? INK : "transparent",
            border: live ? "none" : `2px solid ${MUTED}`,
          }}
        />
        {live ? "Live" : "Open slot"}
      </div>
    </div>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: BG,
          color: INK,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Mark size={56} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{SITE.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
              maxWidth: 900,
            }}
          >
            Every project in one place.
          </div>
          <div style={{ fontSize: 34, color: MUTED }}>Three live at a time, one next step each.</div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <Slot n="01" live />
          <Slot n="02" live />
          <Slot n="03" live={false} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: await regular, weight: 400, style: "normal" },
        { name: "Geist", data: await bold, weight: 700, style: "normal" },
      ],
    },
  );
}
