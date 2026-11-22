import {
  Column,
  Document,
  Grid,
  Heading,
  List,
  ListItem,
  PageFooter,
  PageNumber,
  Row,
  Span,
  Table,
  TableCell,
  TableRow,
  Text,
  token,
} from "@hyper-elements/react";
import type { DocumentProps } from "@hyper-elements/react";
import { DeptBlock, StatBlock, nb } from "./elements";
import { webFonts } from "./fonts";
import { callSheetTheme } from "./theme";
import type { CallSheet, CastMember, Scene } from "./types";

const hairline = { width: 1, style: "solid", color: token("colors.hairline") } as const;
const ink = { width: 1, style: "solid", color: token("colors.rule") } as const;

const dayNightWord: Record<Scene["dayNight"], string> = { D: "Day", N: "Night", DAWN: "Dawn", DUSK: "Dusk" };
const statusLabels: Record<CastMember["status"], string> = {
  SW: "SW start work",
  W: "W work",
  WF: "WF work and finish",
  SWF: "SWF start, work and finish",
  H: "H hold",
};
const statusOrder: readonly CastMember["status"][] = ["SW", "W", "WF", "SWF", "H"];

/** The printed call sheet: what the 2nd AD hands out every night. */
export function CallSheetPdf({ sheet, theme = callSheetTheme }: { sheet: CallSheet; theme?: DocumentProps["theme"] }) {
  const s = sheet;
  const pageTotal = formatEighths(s.schedule.reduce((sum, sc) => sum + eighths(sc.pages), 0));
  const eyebrow = [s.company, s.episode, "Call sheet", `Day ${s.shootDay} of ${s.totalDays}`].filter(Boolean).join(" · ");
  const statusWord = statusOrder
    .filter((st) => s.cast.some((c) => c.status === st))
    .map((st) => statusLabels[st])
    .join(" · ");

  return (
    <Document
      theme={theme}
      lang="en"
      fonts={webFonts}
      size="Letter"
      margin={32}
      title={`${s.production} call sheet, day ${s.shootDay}`}
      style={{ gap: 14 }}
    >
      {/* Masthead: the title, and the one number everyone looks for, in the page's one colour. */}
      <Column style={{ gap: 12 }}>
        <Row style={{ gap: 24, alignItems: "end" }}>
          <Column style={{ gap: 8, flex: 1 }}>
            <Text style={{ apply: ["label"] }}>{eyebrow}</Text>
            <Heading level={1}>{s.production}</Heading>
          </Column>
          <Column style={{ width: 200, gap: 4, alignItems: "end" }}>
            <Text style={{ apply: ["label"], textAlign: "right" }}>General crew call</Text>
            <Text
              style={{
                apply: ["figure"],
                fontWeight: 600,
                fontSize: 40,
                lineHeight: 1,
                letterSpacing: -1.2,
                color: token("colors.accent"),
                textAlign: "right",
              }}
            >
              {nb(s.generalCall)}
            </Text>
          </Column>
        </Row>
        <Row style={{ gap: 16, padding: [8, 0, 0, 0], border: { top: ink } }}>
          <Column style={{ flex: 1 }}>
            <Text style={{ fontWeight: 600 }}>{s.date}</Text>
          </Column>
          <Column style={{ flex: 2 }}>
            <Text style={{ apply: ["muted"], textAlign: "right" }}>
              {`Director ${s.director} · Producer ${s.producer} · 1st AD ${s.firstAD.name}, `}
              <Span style={{ fontFamily: token("fonts.mono") }}>{s.firstAD.phone}</Span>
            </Text>
          </Column>
        </Row>
      </Column>

      {/* The day in six figures, one strip, no boxes. */}
      <Row style={{ gap: 0 }}>
        <StatBlock first label="Shooting call" value={s.shootingCall} />
        <StatBlock label="Lunch" value={s.lunch} />
        <StatBlock label="Est. wrap" value={s.estWrap} />
        <StatBlock label="Sunrise" value={s.weather.sunrise} />
        <StatBlock label="Sunset" value={s.weather.sunset} />
        <StatBlock
          style={{ flex: 1.8 }}
          label="Weather"
          value={`${s.weather.high} / ${s.weather.low}`}
          sub={`${s.weather.summary} · Rain ${s.weather.rain}, ${s.weather.wind}`}
        />
      </Row>

      {/* Where to be, and where to go if someone gets hurt. */}
      <Row style={{ gap: 12, alignItems: "stretch" }}>
        <Column style={{ apply: ["card"], flex: 1 }}>
          <Text style={{ apply: ["label"] }}>Location</Text>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>{s.location.name}</Text>
          <Text>{s.location.address}</Text>
          <Text style={{ apply: ["muted"] }}>{nb(s.location.parking)}</Text>
        </Column>
        <Column
          tokens={{
            colors: {
              background: token("colors.invertBackground"),
              foreground: token("colors.invertForeground"),
              muted: token("colors.invertMuted"),
            },
          }}
          style={{ apply: ["invertCard"], flex: 1 }}
        >
          <Text style={{ apply: ["label"] }}>Nearest hospital</Text>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>{s.hospital.name}</Text>
          <Text>{s.hospital.address}</Text>
          <Text style={{ apply: ["muted"] }}>
            <Span style={{ apply: ["figure"], color: token("colors.foreground") }}>{s.hospital.phone}</Span>
            {` · ${nb(s.hospital.distance)}`}
          </Text>
        </Column>
      </Row>

      {/* Schedule */}
      <Column style={{ gap: 8 }}>
        <Heading level={2}>
          {"Shooting schedule. "}
          <Span style={{ apply: ["muted"] }}>{`${s.schedule.length} scenes, ${pageTotal} pages.`}</Span>
        </Heading>
        <ScheduleTable sheet={s} />
      </Column>

      {/* Cast */}
      <Column style={{ gap: 8 }}>
        <Heading level={2}>
          {"Cast. "}
          <Span style={{ apply: ["muted"], fontSize: 10.5, fontWeight: 400, letterSpacing: 0 }}>{statusWord}</Span>
        </Heading>
        <Table style={{ cellPadding: [4, 8, 4, 0], rowBorder: hairline }}>
          <TableRow header style={{ apply: ["label"] }}>
            <TableCell style={{ width: 24 }}>#</TableCell>
            <TableCell>Actor</TableCell>
            <TableCell>Character</TableCell>
            <TableCell style={{ width: 44 }}>Status</TableCell>
            <TableCell style={{ width: 64 }}>Pickup</TableCell>
            <TableCell style={{ width: 64 }}>Makeup</TableCell>
            <TableCell style={{ width: 64 }}>On set</TableCell>
          </TableRow>
          {s.cast.map((c) => (
            <TableRow key={c.id}>
              <TableCell style={{ apply: ["figure"] }}>{String(c.id)}</TableCell>
              <TableCell style={{ fontWeight: 600 }}>{c.actor}</TableCell>
              <TableCell>{c.character}</TableCell>
              <TableCell style={{ apply: ["figure"] }}>{c.status}</TableCell>
              <TableCell style={{ apply: ["figure"] }}>{nb(c.pickup)}</TableCell>
              <TableCell style={{ apply: ["figure"] }}>{nb(c.hmu)}</TableCell>
              <TableCell style={{ apply: ["figure"], fontWeight: 600 }}>{nb(c.onSet)}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Column>

      {/* Crew */}
      <Column style={{ gap: 8 }}>
        <Heading level={2}>Crew calls</Heading>
        <Grid columns={3} style={{ gap: 20, rowGap: 10 }}>
          {s.departments.map((d) => (
            <DeptBlock key={d.name} name={d.name} crew={d.crew} />
          ))}
        </Grid>
      </Column>

      {/* Notes + tomorrow */}
      <Row style={{ gap: 12, alignItems: "stretch" }}>
        <Column style={{ apply: ["card"], flex: 2, gap: 8 }}>
          <Text style={{ apply: ["label"] }}>Notes and safety</Text>
          <List type="number" style={{ gap: 4, padding: [0, 24, 0, 0] }}>
            {s.notes.map((n, i) => (
              <ListItem key={i}>{nb(n)}</ListItem>
            ))}
          </List>
        </Column>
        <Column style={{ apply: ["card"], flex: 1, gap: 8 }}>
          <Text style={{ apply: ["label"] }}>Tomorrow</Text>
          <Text style={{ fontWeight: 600 }}>{s.advance.date}</Text>
          <Text>{nb(s.advance.scenes)}</Text>
        </Column>
      </Row>

      <PageFooter style={{ padding: [8, 0, 0, 0], border: { top: hairline } }}>
        <Row style={{ gap: 8 }}>
          <Column style={{ flex: 1 }}>
            <Text style={{ apply: ["label"] }}>{`${s.production} · Day ${s.shootDay} · No forced calls without UPM approval`}</Text>
          </Column>
          <Column style={{ width: 80 }}>
            <Text style={{ apply: ["label"], textAlign: "right" }}>
              Page <PageNumber /> of <PageNumber total />
            </Text>
          </Column>
        </Row>
      </PageFooter>
    </Document>
  );
}

export function ScheduleTable({ sheet }: { sheet: CallSheet }) {
  return (
    <Table style={{ cellPadding: [4, 8, 4, 0], rowBorder: hairline }}>
      <TableRow header style={{ apply: ["label"] }}>
        <TableCell style={{ width: 64 }}>Time</TableCell>
        <TableCell style={{ width: 36 }}>Scene</TableCell>
        <TableCell>Set and action</TableCell>
        <TableCell style={{ width: 44 }}>Light</TableCell>
        <TableCell style={{ width: 44 }}>Pages</TableCell>
        <TableCell style={{ width: 44 }}>Cast</TableCell>
      </TableRow>
      {sheet.schedule.map((sc) => (
        <TableRow key={sc.scene}>
          <TableCell style={{ apply: ["figure"] }}>{nb(sc.time)}</TableCell>
          <TableCell style={{ apply: ["figure"], fontWeight: 600 }}>{sc.scene}</TableCell>
          <TableCell>
            <Span style={{ fontWeight: 600 }}>{`${sc.setting}. ${sc.location}`}</Span>
            <Span style={{ apply: ["muted"] }}>{`  ${sc.description}`}</Span>
          </TableCell>
          <TableCell>{dayNightWord[sc.dayNight]}</TableCell>
          <TableCell style={{ apply: ["figure"] }}>{nb(sc.pages)}</TableCell>
          <TableCell style={{ apply: ["figure"] }}>{sc.cast.join(", ")}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

/** "1 3/8" -> 11 */
export function eighths(pages: string): number {
  return pages
    .trim()
    .split(/\s+/)
    .reduce((sum, part) => {
      if (part.includes("/")) {
        const [n, d] = part.split("/").map(Number);
        return sum + (n * 8) / d;
      }
      return sum + Number(part) * 8;
    }, 0);
}

export function formatEighths(total: number): string {
  const whole = Math.floor(total / 8);
  const rest = total % 8;
  if (!rest) return `${whole}`;
  return whole ? `${whole}\u00a0${rest}/8` : `${rest}/8`;
}
