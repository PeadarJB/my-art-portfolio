import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";

export const alt = "Peadar Jolliffe-Byrne — contemporary art portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          background: "linear-gradient(135deg, #0e7a86 0%, #d9822b 55%, #bf4130 100%)",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Art Portfolio
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24, lineHeight: 1.02 }}>
          {siteName}
        </div>
        <div style={{ fontSize: 38, marginTop: 28, opacity: 0.92 }}>
          Colour. Myth. Memory. Contemporary painting.
        </div>
      </div>
    ),
    { ...size }
  );
}
