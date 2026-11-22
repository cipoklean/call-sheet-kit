import {
  Button,
  Column,
  Email,
  Heading,
  LineBreak,
  Link,
  List,
  ListItem,
  MergeTag,
  Section,
  Span,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
} from "@hyper-elements/react";
import type { EmailProps } from "@hyper-elements/react";
import { nb } from "./elements";
import { webFonts } from "./fonts";
import { formatEighths, eighths } from "./pdf";
import { callSheetTheme } from "./theme";
import type { CallSheet } from "./types";

const hairline = { width: 1, style: "solid", color: token("colors.hairline") } as const;

/**
 * The morning email. Rendered once; the sending service fills
 * {{crew_name}}, {{crew_role}}, {{call_time}} and {{crew_note}} per recipient.
 */
export function CallSheetEmail({
  sheet,
  sheetUrl = sheet.sheetUrl,
  theme = callSheetTheme,
}: {
  sheet: CallSheet;
  sheetUrl?: string;
  theme?: EmailProps["theme"];
}) {
  const s = sheet;
  const pageTotal = formatEighths(s.schedule.reduce((sum, sc) => sum + eighths(sc.pages), 0));
  const eyebrow = [s.production, s.episode, `Day ${s.shootDay} of ${s.totalDays}`, s.date].filter(Boolean).join(" · ");

  return (
    <Email
      theme={theme}
      width={600}
      lang="en"
      fonts={webFonts}
      title={`${s.production}, day ${s.shootDay} call sheet`}
      previewText={`Day ${s.shootDay} at ${s.location.name}. General call ${s.generalCall}, wrap around ${s.estWrap}.`}
      style={{ gap: 0 }}
    >
      {/* Your call: the one line everyone opens this for. */}
      <Section style={{ padding: [32, 24, 24, 24], gap: 8 }}>
        <Text style={{ apply: ["label"] }}>{eyebrow}</Text>
        <Text>
          {"Morning, "}
          <MergeTag name="crew_name" />. Your call is
        </Text>
        <Text
          style={{
            apply: ["figure"],
            fontWeight: 600,
            fontSize: 48,
            lineHeight: 1.05,
            letterSpacing: -1,
            color: token("colors.accent"),
          }}
        >
          <MergeTag name="call_time" />
        </Text>
        <Text style={{ apply: ["muted"] }}>
          <MergeTag name="crew_role" />
          {` · General crew call ${nb(s.generalCall)} · Shooting call ${nb(s.shootingCall)}`}
          <Span style={{ color: token("colors.foreground"), fontWeight: 500 }}>
            <MergeTag name="crew_note" />
          </Span>
        </Text>
      </Section>

      {/* Where to be */}
      <Section style={{ padding: [0, 24, 24, 24], gap: 12 }}>
        <Column style={{ apply: ["card"] }}>
          <Text style={{ apply: ["label"] }}>Location</Text>
          <Text style={{ fontWeight: 600 }}>{s.location.name}</Text>
          <Text>{s.location.address}</Text>
          <Text style={{ apply: ["muted"], fontSize: token("fontSizes.sub") }}>{nb(s.location.parking)}</Text>
          <Text style={{ padding: [8, 0, 0, 0] }}>
            <Link href={s.location.mapUrl} style={{ fontWeight: 600, color: token("colors.foreground"), textDecoration: "underline" }}>
              Get directions
            </Link>
          </Text>
        </Column>
        <Column
          tokens={{
            colors: {
              background: token("colors.invertBackground"),
              foreground: token("colors.invertForeground"),
              muted: token("colors.invertMuted"),
            },
          }}
          style={{ apply: ["invertCard"] }}
        >
          <Text style={{ apply: ["label"] }}>Nearest hospital</Text>
          <Text style={{ fontWeight: 600 }}>{s.hospital.name}</Text>
          <Text>{s.hospital.address}</Text>
          <Text style={{ apply: ["muted"] }}>
            <Link
              href={`tel:${s.hospital.phone.replace(/\D/g, "")}`}
              style={{ color: token("colors.foreground"), textDecoration: "none", fontFamily: token("fonts.mono") }}
            >
              {s.hospital.phone}
            </Link>
            {` · ${nb(s.hospital.distance)}`}
          </Text>
        </Column>
      </Section>

      {/* The day */}
      <Section style={{ padding: [8, 24, 24, 24], gap: 12 }}>
        <Heading level={2}>
          {"Today’s schedule. "}
          <Span style={{ apply: ["muted"] }}>{`${s.schedule.length} scenes, ${pageTotal} pages.`}</Span>
        </Heading>
        <Table style={{ cellPadding: [10, 12, 10, 0], rowBorder: hairline, fontSize: 15 }}>
          <TableRow header style={{ apply: ["label"] }}>
            <TableCell style={{ width: 88 }}>Time</TableCell>
            <TableCell style={{ width: 60 }}>Scene</TableCell>
            <TableCell>Set and action</TableCell>
          </TableRow>
          {s.schedule.map((sc) => (
            <TableRow key={sc.scene}>
              <TableCell style={{ apply: ["figure"] }}>{nb(sc.time)}</TableCell>
              <TableCell style={{ apply: ["figure"], fontWeight: 600 }}>{sc.scene}</TableCell>
              <TableCell>
                <Span style={{ fontWeight: 600 }}>{`${sc.setting}. ${sc.location}`}</Span>
                <LineBreak />
                <Span style={{ apply: ["muted"], fontSize: token("fontSizes.sub") }}>{sc.description}</Span>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <Text style={{ apply: ["muted"], fontSize: token("fontSizes.sub") }}>
          {`Lunch ${nb(s.lunch)} · Wrap around ${nb(s.estWrap)} · Sunset ${nb(s.weather.sunset)} · ${s.weather.high}/${s.weather.low}, ${s.weather.summary.toLowerCase()}, rain ${s.weather.rain}`}
        </Text>
      </Section>

      {/* Notes */}
      <Section style={{ padding: [8, 24, 24, 24], gap: 12 }}>
        <Heading level={2}>Before you arrive</Heading>
        <List type="number" style={{ gap: 6 }}>
          {s.notes.map((n, i) => (
            <ListItem key={i}>{nb(n)}</ListItem>
          ))}
        </List>
        <Button href={sheetUrl} style={{ alignSelf: "start", mobile: { width: "100%" } }}>
          Open the full call sheet
        </Button>
      </Section>

      {/* Tomorrow + sign-off */}
      <Section style={{ padding: [24, 24, 32, 24], gap: 8, border: { top: hairline } }}>
        <Text style={{ apply: ["label"] }}>Tomorrow</Text>
        <Text>
          <Span style={{ fontWeight: 600 }}>{s.advance.date}</Span>
          {` · ${nb(s.advance.scenes)}`}
        </Text>
        <Text style={{ apply: ["muted"], fontSize: token("fontSizes.sub"), padding: [16, 0, 0, 0] }}>
          {`Questions about your call? Text ${s.firstAD.name.split(" ")[0]}, 1st AD, at `}
          <Link href={`tel:${s.firstAD.phone.replace(/\D/g, "")}`} style={{ color: token("colors.foreground") }}>
            {s.firstAD.phone}
          </Link>
          {`. ${s.company}.`}
        </Text>
      </Section>
    </Email>
  );
}
