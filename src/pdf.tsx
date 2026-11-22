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
import { DeptBlock, StatBlock, figure, label, nb } from "./elements";
import { callSheetTheme } from "./theme";
import type { CallSheet, Scene } from "./types";

const hairline = { width: 1, style: "solid", color: token("colors.hairline") } as const;
const ink = { width: 1, style: "solid", color: token("colors.rule") } as const;
const muted = { color: token("colors.muted") } as const;

const dayNightWord: Record<Scene["dayNight"], string> = { D: "Day", N: "Night", DAWN: "Dawn", DUSK: "Dusk" };
const statusWord = "SW start work · W work · SWF start, work and finish";

/** The printed call sheet: what the 2nd AD hands out every night. */
export function CallSheetPdf({ sheet }: { sheet: CallSheet }) {
  const s = sheet;
  const pageTotal = formatEighths(s.schedule.reduce((sum, sc) => sum + eighths(sc.pages), 0));
  return (
    <Document
      theme={callSheetTheme}
      size="Letter"
      margin={32}
      title={`${s.production} call sheet, day ${s.shootDay}`}
      style={{ gap: 14 }}
    >
      {/* Masthead: the title, and the one number everyone looks for, in the page's one colour. */}
      <Column style={{ gap: 12 }}>
        <Row style={{ gap: 24, alignItems: "end" }}>
          <Column style={{ gap: 8, flex: 1 }}>
            <Text style={label}>{`${s.company} · Call sheet · Day ${s.shootDay} of ${s.totalDays}`}</Text>
            <Heading level={1}>{s.production}</Heading>
          </Column>
          <Column style={{ width: 200, gap: 4, alignItems: "end" }}>
            <Text style={{ ...label, textAlign: "right" }}>General crew call</Text>
            <Text style={{ ...figure, fontWeight: 600, fontSize: 40, lineHeight: 1, letterSpacing: -1.2, color: token("colors.accent"), textAlign: "right" }}>
              {nb(s.generalCall)}
            </Text>
          </Column>
        </Row>
        <Row style={{ gap: 16, padding: [8, 0, 0, 0], border: { top: ink } }}>
          <Column style={{ flex: 1 }}>
            <Text style={{ fontWeight: 600 }}>{s.date}</Text>
          </Column>
          <Column style={{ flex: 2 }}>
            <Text style={{ ...muted, textAlign: "right" }}>
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
        <StatBlock label="Weather" value={`${s.weather.high} / ${s.weather.low}`} sub={`Rain ${s.weather.rain}, ${s.weather.wind}`} />
      </Row>

      {/* Where to be, and where to go if someone gets hurt. */}
      <Row style={{ gap: 12, alignItems: "stretch" }}>
        <Column style={{ apply: ["card"], flex: 1 }}>
          <Text style={label}>Location</Text>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>{s.location.name}</Text>
          <Text>{s.location.address}</Text>
          <Text style={muted}>{nb(s.location.parking)}</Text>
        </Column>
        <Column
          style={{ flex: 1, padding: 12, gap: 4, borderRadius: 6, backgroundColor: token("colors.field"), color: token("colors.fieldInk") }}
        >
          <Text style={{ ...label, color: token("colors.fieldMuted") }}>Nearest hospital</Text>
          <Text style={{ fontWeight: 600, fontSize: 12 }}>{s.hospital.name}</Text>
          <Text>{s.hospital.address}</Text>
          <Text style={{ color: token("colors.fieldMuted") }}>
            <Span style={{ fontFamily: token("fonts.mono"), color: token("colors.fieldInk") }}>{s.hospital.phone}</Span>
            {` · ${nb(s.hospital.distance)}`}
          </Text>
        </Column>
      </Row>

      {/* Schedule */}
      <Column style={{ gap: 8 }}>
        <Heading level={2}>
          {"Shooting schedule. "}
          <Span style={muted}>{`${s.schedule.length} scenes, ${pageTotal} pages.`}</Span>
        </Heading>
        <ScheduleTable sheet={s} />
      </Column>

      {/* Cast */}
      <Column style={{ gap: 8 }}>
        <Heading level={2}>
          {"Cast. "}
          <Span style={{ ...muted, fontSize: 10.5, fontWeight: 400, letterSpacing: 0 }}>{statusWord}</Span>
        </Heading>
        <Table style={{ cellPadding: [4, 8, 4, 0], rowBorder: hairline }}>
          <TableRow header style={{ ...label }}>
            <TableCell style={{ width: 24}}>#</TableCell>
            <TableCell >Actor</TableCell>
            <TableCell >Character</TableCell>
            <TableCell style={{ width: 44}}>Status</TableCell>
            <TableCell style={{ width: 64}}>Pickup</TableCell>
            <TableCell style={{ width: 64}}>Makeup</TableCell>
            <TableCell style={{ width: 64}}>On set</TableCell>
          </TableRow>
          {s.cast.map((c) => (
            <TableRow key={c.id}>
              <TableCell style={figure}>{String(c.id)}</TableCell>
              <TableCell style={{ fontWeight: 600 }}>{c.actor}</TableCell>
              <TableCell>{c.character}</TableCell>
              <TableCell style={figure}>{c.status}</TableCell>
              <TableCell style={figure}>{nb(c.pickup)}</TableCell>
              <TableCell style={figure}>{nb(c.hmu)}</TableCell>
              <TableCell style={{ ...figure, fontWeight: 600 }}>{nb(c.onSet)}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Column>

      {/* Crew */}
      <Column style={{ gap: 8 }}>
        <Heading level={2}>Crew calls</Heading>
        <Grid columns={3} style={{ gap: 24, rowGap: 10 }}>
          {s.departments.map((d) => (
            <DeptBlock key={d.name} name={d.name} crew={d.crew} />
          ))}
        </Grid>
      </Column>

      {/* Notes + tomorrow */}
      <Row style={{ gap: 12, alignItems: "stretch" }}>
        <Column style={{ apply: ["card"], flex: 2, gap: 8 }}>
          <Text style={label}>Notes and safety</Text>
          <List type="number" style={{ gap: 4 }}>
            {s.notes.map((n, i) => (
              <ListItem key={i}>{nb(n)}</ListItem>
            ))}
          </List>
        </Column>
        <Column style={{ apply: ["card"], flex: 1, gap: 8 }}>
          <Text style={label}>Tomorrow</Text>
          <Text style={{ fontWeight: 600 }}>{s.advance.date}</Text>
          <Text>{nb(s.advance.scenes)}</Text>
        </Column>
      </Row>

      <PageFooter style={{ padding: [8, 0, 0, 0], border: { top: hairline } }}>
        <Row style={{ gap: 8 }}>
          <Column style={{ flex: 1 }}>
            <Text style={label}>{`${s.production} · Day ${s.shootDay} · No forced calls without UPM approval`}</Text>
          </Column>
          <Column style={{ width: 80 }}>
            <Text style={{ ...label, textAlign: "right" }}>
              Page <PageNumber /> of <PageNumber total />
            </Text>
          </Column>
        </Row>
      </PageFooter>
    </Document>
  );
}

export function ScheduleTable({ sheet }: { sheet: CallSheet }) {
  const head = {} as const;
  return (
    <Table style={{ cellPadding: [4, 8, 4, 0], rowBorder: hairline }}>
      <TableRow header style={label}>
        <TableCell style={{ ...head, width: 64 }}>Time</TableCell>
        <TableCell style={{ ...head, width: 36 }}>Scene</TableCell>
        <TableCell style={head}>Set and action</TableCell>
        <TableCell style={{ ...head, width: 44 }}>Light</TableCell>
        <TableCell style={{ ...head, width: 44 }}>Pages</TableCell>
        <TableCell style={{ ...head, width: 44 }}>Cast</TableCell>
      </TableRow>
      {sheet.schedule.map((sc) => (
        <TableRow key={sc.scene}>
          <TableCell style={figure}>{nb(sc.time)}</TableCell>
          <TableCell style={{ ...figure, fontWeight: 600 }}>{sc.scene}</TableCell>
          <TableCell>
            <Span style={{ fontWeight: 600 }}>{`${sc.setting}. ${sc.location}`}</Span>
            <Span style={muted}>{`  ${sc.description}`}</Span>
          </TableCell>
          <TableCell>{dayNightWord[sc.dayNight]}</TableCell>
          <TableCell style={figure}>{sc.pages}</TableCell>
          <TableCell style={figure}>{sc.cast.join(", ")}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

/** "1 3/8" -> 11 */
export function eighths(pages: string): number {
  return pages.split(" ").reduce((sum, part) => {
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
  return whole ? `${whole} ${rest}/8` : `${rest}/8`;
}
