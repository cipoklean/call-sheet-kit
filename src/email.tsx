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
import { figure, label, nb } from "./elements";
import { formatEighths, eighths } from "./pdf";
import { callSheetTheme } from "./theme";
import type { CallSheet } from "./types";

/** Web fonts load where a client allows them; everywhere else falls back to Arial and Courier New. */
const PLEX = "https://cdn.jsdelivr.net/fontsource/fonts";
const emailFonts = [400, 500, 600].flatMap((w) => [
  { family: "IBM Plex Sans", src: `${PLEX}/ibm-plex-sans@latest/latin-${w}-normal.woff2`, format: "woff2", weight: w },
  { family: "IBM Plex Mono", src: `${PLEX}/ibm-plex-mono@latest/latin-${w}-normal.woff2`, format: "woff2", weight: w },
]) as never;

const hairline = { width: 1, style: "solid", color: token("colors.hairline") } as const;
const muted = { color: token("colors.muted") } as const;
const small = { fontSize: 13, fontWeight: 500, color: token("colors.muted") } as const;

/**
 * The morning email. Rendered once; the sending service fills
 * {{crew_name}}, {{crew_role}} and {{call_time}} per recipient.
 */
export function CallSheetEmail({ sheet, sheetUrl }: { sheet: CallSheet; sheetUrl: string }) {
  const s = sheet;
  const pageTotal = formatEighths(s.schedule.reduce((sum, sc) => sum + eighths(sc.pages), 0));
  return (
    <Email
      theme={callSheetTheme}
      width={600}
      lang="en"
      fonts={emailFonts}
      title={`${s.production}, day ${s.shootDay} call sheet`}
      previewText={`Day ${s.shootDay} at ${s.location.name}. General call ${s.generalCall}, wrap around ${s.estWrap}.`}
      style={{ fontSize: 16, lineHeight: 1.5, backgroundColor: "#ffffff", gap: 0 }}
    >
      {/* Your call: the one line everyone opens this for. */}
      <Section style={{ padding: [32, 24, 24, 24], gap: 8 }}>
        <Text style={small}>{`${s.production} · Day ${s.shootDay} of ${s.totalDays} · ${s.date}`}</Text>
        <Text style={{ fontSize: 16 }}>
          {"Morning, "}
          <MergeTag name="crew_name" />. Your call is
        </Text>
        <Text style={{ ...figure, fontWeight: 600, fontSize: 48, lineHeight: 1.05, letterSpacing: -1, color: token("colors.accent") }}>
          <MergeTag name="call_time" />
        </Text>
        <Text style={muted}>
          <MergeTag name="crew_role" />
          {` · General crew call ${nb(s.generalCall)} · Shooting call ${nb(s.shootingCall)}`}
        </Text>
      </Section>

      {/* Where to be */}
      <Section style={{ padding: [0, 24, 24, 24], gap: 12 }}>
        <Column style={{ apply: ["card"], padding: 16, gap: 4 }}>
          <Text style={small}>Location</Text>
          <Text style={{ fontWeight: 600 }}>{s.location.name}</Text>
          <Text>{s.location.address}</Text>
          <Text style={{ ...muted, fontSize: 14 }}>{nb(s.location.parking)}</Text>
          <Text style={{ padding: [8, 0, 0, 0] }}>
            <Link href={s.location.mapUrl} style={{ fontWeight: 600, color: token("colors.foreground"), textDecoration: "underline" }}>
              Get directions
            </Link>
          </Text>
        </Column>
        <Column
          style={{ padding: 16, gap: 4, borderRadius: 6, backgroundColor: token("colors.field"), color: token("colors.fieldInk") }}
        >
          <Text style={{ ...small, color: token("colors.fieldMuted") }}>Nearest hospital</Text>
          <Text style={{ fontWeight: 600, color: token("colors.fieldInk") }}>{s.hospital.name}</Text>
          <Text style={{ color: token("colors.fieldInk") }}>{s.hospital.address}</Text>
          <Text style={{ color: token("colors.fieldMuted") }}>
            <Link href={`tel:${s.hospital.phone.replace(/\D/g, "")}`} style={{ color: token("colors.fieldInk"), textDecoration: "none", fontFamily: token("fonts.mono") }}>
              {s.hospital.phone}
            </Link>
            {` · ${nb(s.hospital.distance)}`}
          </Text>
        </Column>
      </Section>

      {/* The day */}
      <Section style={{ padding: [8, 24, 24, 24], gap: 12 }}>
        <Heading level={2} style={{ fontSize: 20, letterSpacing: -0.4 }}>
          {"Today’s schedule. "}
          <Span style={muted}>{`${s.schedule.length} scenes, ${pageTotal} pages.`}</Span>
        </Heading>
        <Table style={{ cellPadding: [10, 12, 10, 0], rowBorder: hairline, fontSize: 15 }}>
          <TableRow header style={small}>
            <TableCell style={{ width: 88 }}>Time</TableCell>
            <TableCell style={{ width: 60 }}>Scene</TableCell>
            <TableCell>Set and action</TableCell>
          </TableRow>
          {s.schedule.map((sc) => (
            <TableRow key={sc.scene}>
              <TableCell style={figure}>{nb(sc.time)}</TableCell>
              <TableCell style={{ ...figure, fontWeight: 600 }}>{sc.scene}</TableCell>
              <TableCell>
                <Span style={{ fontWeight: 600 }}>{`${sc.setting}. ${sc.location}`}</Span>
                <LineBreak />
                <Span style={{ ...muted, fontSize: 14 }}>{sc.description}</Span>
              </TableCell>
            </TableRow>
          ))}
        </Table>
        <Text style={{ ...muted, fontSize: 14 }}>
          {`Lunch ${nb(s.lunch)} · Wrap around ${nb(s.estWrap)} · Sunset ${nb(s.weather.sunset)} · ${s.weather.high}/${s.weather.low}, rain ${s.weather.rain}`}
        </Text>
      </Section>

      {/* Notes */}
      <Section style={{ padding: [8, 24, 24, 24], gap: 12 }}>
        <Heading level={2} style={{ fontSize: 20, letterSpacing: -0.4 }}>Before you arrive</Heading>
        <List type="number" style={{ gap: 6 }}>
          {s.notes.map((n, i) => (
            <ListItem key={i}>{nb(n)}</ListItem>
          ))}
        </List>
        <Button href={sheetUrl} style={{ alignSelf: "start", fontSize: 16, padding: [14, 24], backgroundColor: token("colors.foreground"), color: "#ffffff", mobile: { width: "100%" } }}>
          Open the full call sheet
        </Button>
      </Section>

      {/* Tomorrow + sign-off */}
      <Section style={{ padding: [24, 24, 32, 24], gap: 8, border: { top: hairline } }}>
        <Text style={small}>Tomorrow</Text>
        <Text>
          <Span style={{ fontWeight: 600 }}>{s.advance.date}</Span>
          {` · ${nb(s.advance.scenes)}`}
        </Text>
        <Text style={{ ...muted, fontSize: 14, padding: [16, 0, 0, 0] }}>
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
