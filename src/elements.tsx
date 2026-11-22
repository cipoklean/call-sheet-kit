import { Column, Row, Span, Text, defineElement, prop, token } from "@hyper-elements/react";

// Shared text recipes (one label look, one figure look, page-wide).
export const label = { fontSize: 9, fontWeight: 500, color: token("colors.muted") } as const;
export const figure = { fontFamily: token("fonts.mono"), fontWeight: 500 } as const;

/** Keeps a number on the same line as its unit: "6:30 AM", "2.4 mi". */
export const nb = (s: string) => s.replace(/(\d) (AM|PM|mi|min|mph)\b/g, "$1\u00a0$2");

/** One figure in the day strip: a label over a tabular value. */
export const StatBlock = defineElement({
  type: "callsheet.StatBlock",
  label: "Stat block",
  description: "A quiet label over one figure, set in the mono face so times line up.",
  props: {
    label: prop.text({ label: "Label", required: true, maxLength: 24 }),
    value: prop.text({ label: "Value", required: true, maxLength: 24 }),
    sub: prop.text({ label: "Sub line", maxLength: 40 }),
    first: prop.boolean({ label: "First in its row", default: false }),
  },
  render: ({ label: l, value, sub, first }) => (
    <Column
      style={{
        gap: 2,
        padding: first ? [0, 12, 0, 0] : [0, 12],
        border: first ? undefined : { left: { width: 1, style: "solid", color: token("colors.hairline") } },
      }}
    >
      <Text style={label}>{l}</Text>
      <Text style={{ ...figure, fontSize: 15, lineHeight: 1.2 }}>{nb(value)}</Text>
      {sub ? <Text style={{ ...label, fontWeight: 400 }}>{sub}</Text> : null}
    </Column>
  ),
});

/** One department: its name on a rule, then role, name and call for each person. */
export const DeptBlock = defineElement({
  type: "callsheet.DeptBlock",
  label: "Department block",
  description: "A department name on an ink rule, then each crew member's role, name and call time.",
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
        border: { top: { width: 1, style: "solid", color: token("colors.rule") } },
      }}
    >
      <Text style={{ fontWeight: 600 }}>{name}</Text>
      {crew.map((p) => (
        <Column key={p.role + p.name} style={{ gap: 0 }}>
          <Row stackOnMobile={false} style={{ gap: 8 }}>
            <Column style={{ width: 72 }}>
              <Text style={label}>{p.role}</Text>
            </Column>
            <Column>
              <Text>{p.name}</Text>
            </Column>
            <Column style={{ width: 52 }}>
              <Text style={{ ...figure, textAlign: "right" }}>{nb(p.call)}</Text>
            </Column>
          </Row>
          {p.note ? (
            <Text style={{ ...label, fontWeight: 400, padding: [0, 0, 0, 80] }}>
              <Span>{p.note}</Span>
            </Text>
          ) : null}
        </Column>
      ))}
    </Column>
  ),
});
