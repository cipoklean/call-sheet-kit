import { Canvas, Column, Heading, Row, Span, Text, token } from "@hyper-elements/react";
import type { CanvasProps } from "@hyper-elements/react";
import { StatBlock, nb } from "./elements";
import { callSheetTheme } from "./theme";
import type { CallSheet } from "./types";

const hairline = { width: 2, style: "solid", color: token("colors.hairline") } as const;
const ink = { width: 3, style: "solid", color: token("colors.rule") } as const;

/** Tightens the wide advance of a monospace space at large display sizes. */
function tightSpaces(value: string, spaceSize: number) {
  const parts = value.split(" ");
  if (parts.length <= 1) return value;
  return parts.map((part, i) => (
    <Span key={i}>
      {i > 0 ? <Span style={{ fontSize: spaceSize }}>{"\u00a0"}</Span> : null}
      {part}
    </Span>
  ));
}

/**
 * The card the 2nd AD drops in the crew group chat the night before:
 * 1080 x 1350, readable in a phone's chat bubble without opening it.
 */
export function CallSheetCard({ sheet, theme = callSheetTheme }: { sheet: CallSheet; theme?: CanvasProps["theme"] }) {
  const s = sheet;
  const shortDate = s.date.replace(/, \d{4}$/, "");
  const eyebrow = [s.production, s.episode, `Day ${s.shootDay} of ${s.totalDays}`].filter(Boolean).join(" · ");

  return (
    <Canvas
      theme={theme}
      width={1080}
      height={1350}
      title={`${s.production} day ${s.shootDay}`}
      style={{ padding: 72, gap: 28 }}
    >
      {/* Who and when */}
      <Column style={{ gap: 12 }}>
        <Text style={{ apply: ["label"] }}>{eyebrow}</Text>
        <Heading level={1} fit={{ sizes: [64, 56, 48], maxLines: 1 }}>
          {shortDate}
        </Heading>
      </Column>

      {/* The call */}
      <Column style={{ gap: 4, padding: [24, 0, 0, 0], border: { top: ink } }}>
        <Text style={{ apply: ["label"] }}>General crew call</Text>
        <Text
          style={{
            apply: ["figure"],
            fontWeight: 600,
            fontSize: 120,
            lineHeight: 1,
            letterSpacing: -4.5,
            color: token("colors.accent"),
          }}
        >
          {tightSpaces(s.generalCall, 44)}
        </Text>
      </Column>

      <Row style={{ gap: 0 }}>
        <StatBlock first label="Shooting call" value={s.shootingCall} />
        <StatBlock label="Lunch" value={s.lunch} />
        <StatBlock label="Est. wrap" value={s.estWrap} />
      </Row>

      {/* Where */}
      <Column style={{ apply: ["card"] }}>
        <Text style={{ apply: ["label"] }}>Location</Text>
        <Text fit={{ sizes: [40, 34, 28], maxLines: 2 }} style={{ fontWeight: 600, lineHeight: 1.15 }}>
          {s.location.name}
        </Text>
        <Text>{s.location.address}</Text>
        <Text style={{ apply: ["muted"], fontSize: token("fontSizes.sub") }}>{nb(s.location.parking)}</Text>
      </Column>

      {/* What we shoot */}
      <Column style={{ gap: 0 }}>
        <Text style={{ apply: ["label"], padding: [0, 0, 8, 0] }}>{`${s.schedule.length} scenes today`}</Text>
        {s.schedule.map((sc) => (
          <Row key={sc.scene} style={{ gap: 24, padding: [8, 0], border: { top: hairline }, alignItems: "center" }}>
            <Column style={{ width: 170 }}>
              <Text style={{ apply: ["figure"], fontSize: 28 }}>{nb(sc.time)}</Text>
            </Column>
            <Column style={{ width: 64 }}>
              <Text style={{ apply: ["figure"], fontWeight: 600, fontSize: 28 }}>{sc.scene}</Text>
            </Column>
            <Column style={{ flex: 1 }}>
              <Text style={{ fontSize: 28 }}>{`${sc.setting}. ${sc.location}`}</Text>
            </Column>
          </Row>
        ))}
      </Column>

      {/* Safety, last and loudest after the call */}
      <Row
        tokens={{
          colors: {
            background: token("colors.invertBackground"),
            foreground: token("colors.invertForeground"),
            muted: token("colors.invertMuted"),
          },
        }}
        style={{ apply: ["invertCard"], gap: 24, alignItems: "center" }}
      >
        <Column style={{ flex: 1, gap: 4 }}>
          <Text style={{ apply: ["label"] }}>Nearest hospital</Text>
          <Text fit={{ sizes: [32, 28, 24], maxLines: 2 }} style={{ fontWeight: 600 }}>
            {s.hospital.name}
          </Text>
        </Column>
        <Column style={{ width: 300, gap: 4 }}>
          <Text style={{ apply: ["figure"], fontSize: 32, textAlign: "right" }}>
            {tightSpaces(s.hospital.phone, 12)}
          </Text>
          <Text style={{ apply: ["label"], textAlign: "right" }}>{nb(s.hospital.distance)}</Text>
        </Column>
      </Row>
    </Canvas>
  );
}
