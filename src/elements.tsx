import { Column, Row, Span, Text, defineElement, prop, token } from "@hyper-elements/react";

/** A labelled number: weather, sunrise, call times. */
export const StatBlock = defineElement({
  type: "callsheet.StatBlock",
  label: "Stat block",
  description: "A small label over one big value, with an optional line under it.",
  props: {
    label: prop.text({ label: "Label", required: true, maxLength: 24 }),
    value: prop.text({ label: "Value", required: true, maxLength: 24 }),
    sub: prop.text({ label: "Sub line", maxLength: 40 }),
    tone: prop.choice(["plain", "signal", "inverse"], { label: "Tone", default: "plain" }),
  },
  render: ({ label, value, sub, tone }) => {
    const inverse = tone === "inverse";
    return (
      <Column
        style={{
          padding: [8, 10],
          gap: 2,
          borderRadius: 4,
          backgroundColor: inverse ? token("colors.foreground") : token("colors.panel"),
        }}
      >
        <Text
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: inverse ? "#bdbdbd" : token("colors.muted"),
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 800,
            lineHeight: 1.1,
            color: tone === "signal" ? token("colors.signal") : inverse ? "#ffffff" : token("colors.foreground"),
          }}
        >
          {value}
        </Text>
        {sub ? (
          <Text style={{ fontSize: 8, color: inverse ? "#bdbdbd" : token("colors.muted") }}>{sub}</Text>
        ) : null}
      </Column>
    );
  },
});

/** One department's crew list with call times. */
export const DeptBlock = defineElement({
  type: "callsheet.DeptBlock",
  label: "Department block",
  description: "A department heading and its crew: role, name and call time.",
  props: {
    name: prop.text({ label: "Department", required: true, maxLength: 40 }),
    crew: prop.list(
      prop.object(
        {
          role: prop.text({ label: "Role", required: true, maxLength: 24 }),
          name: prop.text({ label: "Name", required: true, maxLength: 40 }),
          call: prop.text({ label: "Call", required: true, maxLength: 10 }),
          note: prop.text({ label: "Note", maxLength: 60 }),
        },
        { label: "Crew member" },
      ),
      { label: "Crew", required: true, min: 1, max: 20 },
    ),
  },
  render: ({ name, crew }) => (
    <Column
      style={{
        gap: 3,
        padding: [6, 0, 0, 0],
        border: { top: { width: 2, style: "solid", color: token("colors.rule") } },
      }}
    >
      <Text style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>{name}</Text>
      {crew.map((p) => (
        <Row key={p.role + p.name} stackOnMobile={false} style={{ gap: 6 }}>
          <Column style={{ width: 70 }}>
            <Text style={{ fontSize: 8, color: token("colors.muted") }}>{p.role}</Text>
          </Column>
          <Column>
            <Text style={{ fontSize: 9 }}>
              {p.name}
              {p.note ? <Span style={{ color: token("colors.signal"), fontSize: 8 }}>{" · " + p.note}</Span> : null}
            </Text>
          </Column>
          <Column style={{ width: 46 }}>
            <Text style={{ fontSize: 9, fontWeight: 700, textAlign: "right" }}>{p.call}</Text>
          </Column>
        </Row>
      ))}
    </Column>
  ),
});
