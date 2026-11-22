import { Column, Row, Span, Text, defineElement, prop, token } from "@hyper-elements/react";

/** Keeps a number on the same line as its unit or fraction: "6:30 AM", "2.4 mi", "1 2/8". */
export const nb = (s: string) => s.replace(/(\d) (AM|PM|mi|min|mph|\d+\/\d+)\b/g, "$1\u00a0$2");

/** One figure in the day strip: a label over a tabular value. Scales automatically per root via theme formats. */
export const StatBlock = defineElement({
  type: "callsheet.StatBlock",
  label: "Stat block",
  description: "A quiet label over one figure, set in the mono face so times line up.",
  props: {
    label: prop.text({ label: "Label", required: true, maxLength: 24 }),
    value: prop.text({ label: "Value", required: true, maxLength: 24 }),
    sub: prop.text({ label: "Sub line", maxLength: 60 }),
    first: prop.boolean({ label: "First in its row", default: false }),
  },
  render: ({ label: l, value, sub, first }) => (
    <Column
      style={{
        apply: first ? [] : ["statDivider"],
        gap: token("spacing.statGap"),
        padding: first ? [0, token("spacing.statPad"), 0, 0] : [0, token("spacing.statPad")],
      }}
    >
      <Text style={{ apply: ["label"] }}>{l}</Text>
      <Text style={{ apply: ["figure"], fontSize: token("fontSizes.stat"), lineHeight: token("lineHeights.stat") }}>
        {nb(value)}
      </Text>
      {sub ? <Text style={{ apply: ["label"], fontWeight: 400 }}>{nb(sub)}</Text> : null}
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
          phone: prop.text({ label: "Phone", maxLength: 24 }),
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
      {crew.map((p) => {
        const detail = [p.note, p.phone].filter(Boolean).join(" · ");
        return (
          <Column key={p.role + p.name} style={{ gap: 0 }}>
            <Row stackOnMobile={false} style={{ gap: 8, alignItems: "center" }}>
              <Column style={{ width: 80 }}>
                <Text style={{ apply: ["label"] }}>{p.role}</Text>
              </Column>
              <Column>
                <Text>{p.name}</Text>
              </Column>
              <Column style={{ width: 52 }}>
                <Text style={{ apply: ["figure"], textAlign: "right" }}>{nb(p.call)}</Text>
              </Column>
            </Row>
            {detail ? (
              <Text style={{ apply: ["label"], fontWeight: 400, padding: [0, 0, 0, 88] }}>
                <Span>{nb(detail)}</Span>
              </Text>
            ) : null}
          </Column>
        );
      })}
    </Column>
  ),
});
