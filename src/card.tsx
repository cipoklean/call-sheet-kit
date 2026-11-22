import { Canvas, Column, Heading, Row, Text, token } from "@hyper-elements/react";
import { figure, nb } from "./elements";
import { callSheetTheme } from "./theme";
import type { CallSheet } from "./types";

const hairline = { width: 2, style: "solid", color: token("colors.hairline") } as const;
const ink = { width: 3, style: "solid", color: token("colors.rule") } as const;
const label = { fontSize: 26, fontWeight: 500, color: token("colors.muted") } as const;

/**
 * The card the 2nd AD drops in the crew group chat the night before:
 * 1080 x 1350, readable in a phone's chat bubble without opening it.
 */
export function CallSheetCard({ sheet }: { sheet: CallSheet }) {
  const s = sheet;
  const shortDate = s.date.replace(/, \d{4}$/, "");
  return (
    <Canvas
      theme={callSheetTheme}
      width={1080}
      height={1350}
      title={`${s.production} day ${s.shootDay}`}
      style={{ padding: 72, gap: 28, backgroundColor: "#ffffff", fontSize: 30, lineHeight: 1.35 }}
    >
      {/* Who and when */}
      <Column style={{ gap: 12 }}>
        <Text style={label}>{`${s.production} · Day ${s.shootDay} of ${s.totalDays}`}</Text>
        <Heading level={1} style={{ fontSize: 64, letterSpacing: -2.2, lineHeight: 1.05 }}>
          {shortDate}
        </Heading>
      </Column>

      {/* The call */}
      <Row style={{ gap: 0, padding: [24, 0, 0, 0], border: { top: ink } }}>
        <Column style={{ flex: 3, gap: 4 }}>
          <Text style={label}>General crew call</Text>
          <Text style={{ ...figure, fontWeight: 600, fontSize: 120, lineHeight: 1, letterSpacing: -4.5, color: token("colors.accent") }}>
            {nb(s.generalCall)}
          </Text>
        </Column>
      </Row>

      <Row style={{ gap: 0 }}>
        {[
          ["Shooting call", s.shootingCall],
          ["Lunch", s.lunch],
          ["Est. wrap", s.estWrap],
        ].map(([l, v], i) => (
          <Column
            key={l}
            style={{
              flex: 1,
              gap: 4,
              padding: i === 0 ? [0, 24, 0, 0] : [0, 24],
              border: i === 0 ? undefined : { left: hairline },
            }}
          >
            <Text style={label}>{l}</Text>
            <Text style={{ ...figure, fontSize: 40, lineHeight: 1.1 }}>{nb(v)}</Text>
          </Column>
        ))}
      </Row>

      {/* Where */}
      <Column style={{ backgroundColor: token("colors.surface"), borderRadius: 16, padding: 28, gap: 4 }}>
        <Text style={label}>Location</Text>
        <Text style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.15 }}>{s.location.name}</Text>
        <Text>{s.location.address}</Text>
        <Text style={{ color: token("colors.muted"), fontSize: 26 }}>{nb(s.location.parking)}</Text>
      </Column>

      {/* What we shoot */}
      <Column style={{ gap: 0 }}>
        <Text style={{ ...label, padding: [0, 0, 8, 0] }}>{`${s.schedule.length} scenes today`}</Text>
        {s.schedule.map((sc) => (
          <Row key={sc.scene} style={{ gap: 24, padding: [8, 0], border: { top: hairline }, alignItems: "center" }}>
            <Column style={{ width: 170 }}>
              <Text style={{ ...figure, fontSize: 28 }}>{nb(sc.time)}</Text>
            </Column>
            <Column style={{ width: 64 }}>
              <Text style={{ ...figure, fontWeight: 600, fontSize: 28 }}>{sc.scene}</Text>
            </Column>
            <Column style={{ flex: 1 }}>
              <Text style={{ fontSize: 28 }}>{`${sc.setting}. ${sc.location}`}</Text>
            </Column>
          </Row>
        ))}
      </Column>

      {/* Safety, last and loudest after the call */}
      <Row
        style={{ gap: 24, padding: [24, 28], borderRadius: 16, backgroundColor: token("colors.field"), color: token("colors.fieldInk"), alignItems: "center" }}
      >
        <Column style={{ flex: 1, gap: 4 }}>
          <Text style={{ ...label, color: token("colors.fieldMuted") }}>Nearest hospital</Text>
          <Text style={{ fontWeight: 600, fontSize: 32, color: token("colors.fieldInk") }}>{s.hospital.name}</Text>
        </Column>
        <Column style={{ width: 300, gap: 4 }}>
          <Text style={{ ...figure, fontSize: 32, textAlign: "right", color: token("colors.fieldInk") }}>{s.hospital.phone}</Text>
          <Text style={{ ...label, textAlign: "right", color: token("colors.fieldMuted") }}>{nb(s.hospital.distance)}</Text>
        </Column>
      </Row>
    </Canvas>
  );
}
