"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { C, F } from "@/lib/styles";

interface Props {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  focalPosition?: string;
  priority?: boolean;
  assetLabel?: string;
  sizes?: string;
}

export default function ImageWithFallback({ src, alt, fill, width, height, style = {}, focalPosition = "center center", priority = false, assetLabel, sizes }: Props) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: C.champagne,
        border: `1.5px dashed rgba(182,150,89,0.4)`,
        borderRadius: "inherit",
        color: C.secondary,
        fontFamily: F.body,
        fontSize: "0.72rem",
        textAlign: "center" as const,
        padding: "1.25rem",
        width: "100%",
        height: "100%",
        minHeight: 80,
      }}>
        <ImageIcon size={26} style={{ opacity: 0.35 }} color={C.secondary} />
        <span style={{ opacity: 0.6 }}>{assetLabel ?? src?.split("/").pop() ?? "Asset pending"}</span>
      </div>
    );
  }

  const imgStyle: React.CSSProperties = {
    objectFit: "cover",
    objectPosition: focalPosition,
    ...style,
  };

  if (fill) {
    return (
      <Image src={src} alt={alt} fill className="" style={imgStyle}
        onError={() => setError(true)} priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      />
    );
  }

  return (
    <Image src={src} alt={alt} width={width ?? 600} height={height ?? 400}
      style={imgStyle} onError={() => setError(true)} priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, 600px"}
    />
  );
}
