import {
  Column,
  Document,
  Grid,
  Heading,
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
import { DeptBlock, StatBlock } from "./elements";
import { callSheetTheme } from "./theme";
import type { CallSheet } from "./types";

const label = { fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: token("colors.muted") } as const;
const mono = { fontFamily: token("fonts.mono") } as const;

/** The printed call sheet: what the 2nd AD hands out every night. */
export function CallSheetPdf({ sheet }: { sheet: CallSheet }) {
  const s = sheet;
  return (
    <Document
      theme={callSheetTheme}
      size="Letter"
      margin={36}
      title={`${s.production} call sheet, day ${s.shootDay}`}
      style={{ gap: 12 }}
    >
      {/* Masthead */}
      <Row style={{ gap: 12, alignItems: "stretch" }}>
        <Column style={{ gap: 2, flex: 1 }}>
          <Text style={label}>{s.company} · Call sheet</Text>
          <Heading level={1} style={{ fontSize: 34, lineHeight: 1 }}>
            {s.production}
          </Heading>
          <Text style={{ fontSize: 10 }}>
            <Span style={{ fontWeight: 700 }}>{s.date}</Span>
            {`  ·  Day ${s.shootDay} of ${s.totalDays}`}
          </Text>
          <Text style={{ fontSize: 9, color: token("colors.muted") }}>
            {`Director ${s.director}  ·  Producer ${s.producer}  ·  1st AD ${s.firstAD.name} ${s.firstAD.phone}`}
          </Text>
        </Column>
        <Column
          style={{
            width: 168,
            padding: [10, 12],
            gap: 2,
            borderRadius: 4,
            backgroundColor: token("colors.foreground"),
            color: "#ffffff",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#bdbdbd" }}>
            General crew call
          </Text>
          <Text style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: token("colors.signal"), ...mono }}>
            {s.generalCall}
          </Text>
          <Text style={{ fontSize: 8, color: "#bdbdbd" }}>Check your individual call below</Text>
        </Column>
      </Row>

      {/* Day at a glance */}
      <Grid columns={6} style={{ gap: 6 }}>
        <StatBlock label="Shooting call" value={s.shootingCall} />
        <StatBlock label="Lunch" value={s.lunch} />
        <StatBlock label="Est. wrap" value={s.estWrap} />
        <StatBlock label="Sunrise" value={s.weather.sunrise} tone="signal" />
        <StatBlock label="Sunset" value={s.weather.sunset} tone="signal" />
        <StatBlock label="Weather" value={`${s.weather.high} / ${s.weather.low}`} sub={`Rain ${s.weather.rain} · ${s.weather.wind}`} />
      </Grid>

      {/* Location + hospital */}
      <Row style={{ gap: 6 }}>
        <Column style={{ apply: ["panel"], flex: 3 }}>
          <Text style={label}>Location</Text>
          <Text style={{ fontWeight: 700 }}>{s.location.name}</Text>
          <Text>{s.location.address}</Text>
          <Text style={{ fontSize: 9, color: token("colors.muted") }}>{s.location.parking}</Text>
        </Column>
        <Column
          style={{
            flex: 2,
            padding: 12,
            gap: 4,
            borderRadius: 4,
            border: { width: 2, style: "solid", color: token("colors.danger") },
          }}
        >
          <Text style={{ ...label, color: token("colors.danger") }}>Nearest hospital</Text>
          <Text style={{ fontWeight: 700 }}>{s.hospital.name}</Text>
          <Text>{s.hospital.address}</Text>
          <Text style={{ fontSize: 9 }}>
            <Span style={{ fontWeight: 700 }}>{s.hospital.phone}</Span>
            {`  ·  ${s.hospital.distance}`}
          </Text>
        </Column>
      </Row>

      {/* Shooting schedule */}
      <Column style={{ gap: 4 }}>
        <Heading level={2}>Shooting schedule</Heading>
        <ScheduleTable sheet={s} />
      </Column>

      {/* Cast */}
      <Column style={{ gap: 4 }}>
        <Heading level={2}>Cast</Heading>
        <Table style={{ cellPadding: [5, 6], rowBorder: { width: 1, style: "solid", color: token("colors.border") }, fontSize: 9 }}>
          <TableRow header style={{ backgroundColor: token("colors.panel") }}>
            <TableCell style={{ width: 24 }}>#</TableCell>
            <TableCell>Actor</TableCell>
            <TableCell>Character</TableCell>
            <TableCell style={{ width: 46 }}>Status</TableCell>
            <TableCell style={{ width: 62 }}>Pickup</TableCell>
            <TableCell style={{ width: 62 }}>HMU</TableCell>
            <TableCell style={{ width: 62 }}>On set</TableCell>
          </TableRow>
          {s.cast.map((c) => (
            <TableRow key={c.id}>
              <TableCell style={{ fontWeight: 700 }}>{String(c.id)}</TableCell>
              <TableCell style={{ fontWeight: 700 }}>{c.actor}</TableCell>
              <TableCell>{c.character}</TableCell>
              <TableCell>{c.status}</TableCell>
              <TableCell>{c.pickup}</TableCell>
              <TableCell>{c.hmu}</TableCell>
              <TableCell style={{ fontWeight: 700, color: token("colors.signal") }}>{c.onSet}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Column>

      {/* Crew */}
      <Column style={{ gap: 6 }}>
        <Heading level={2}>Crew calls</Heading>
        <Grid columns={3} style={{ gap: 12, rowGap: 10 }}>
          {s.departments.map((d) => (
            <DeptBlock key={d.name} name={d.name} crew={d.crew} />
          ))}
        </Grid>
      </Column>

      {/* Notes + advance */}
      <Row style={{ gap: 6 }}>
        <Column style={{ apply: ["panel"], flex: 3 }}>
          <Text style={label}>Notes & safety</Text>
          {s.notes.map((n, i) => (
            <Text key={i} style={{ fontSize: 9 }}>
              {`${i + 1}. ${n}`}
            </Text>
          ))}
        </Column>
        <Column style={{ apply: ["panel"], flex: 2 }}>
          <Text style={label}>Advance schedule</Text>
          <Text style={{ fontWeight: 700, fontSize: 9 }}>{s.advance.date}</Text>
          <Text style={{ fontSize: 9 }}>{s.advance.scenes}</Text>
        </Column>
      </Row>

      <PageFooter style={{ padding: [8, 0, 0, 0], border: { top: { width: 1, style: "solid", color: token("colors.border") } } }}>
        <Row style={{ gap: 8 }}>
          <Column style={{ flex: 1 }}>
            <Text style={{ fontSize: 8, color: token("colors.muted") }}>
              {`${s.production} · Day ${s.shootDay} · No forced calls without UPM approval · Questions: ${s.firstAD.name}, ${s.firstAD.phone}`}
            </Text>
          </Column>
          <Column style={{ width: 70 }}>
            <Text style={{ fontSize: 8, textAlign: "right", color: token("colors.muted") }}>
              Page <PageNumber /> of <PageNumber total />
            </Text>
          </Column>
        </Row>
      </PageFooter>
    </Document>
  );
}

const dayNightColor: Record<string, string> = { D: "#f2c94c", N: "#2f3a56", DAWN: "#f4a261", DUSK: "#9d6bb3" };

export function ScheduleTable({ sheet }: { sheet: CallSheet }) {
  const totalEighths = sheet.schedule.reduce((sum, sc) => sum + eighths(sc.pages), 0);
  return (
    <Table style={{ cellPadding: [5, 6], rowBorder: { width: 1, style: "solid", color: token("colors.border") }, fontSize: 9 }}>
      <TableRow header style={{ backgroundColor: token("colors.foreground"), color: "#ffffff" }}>
        <TableCell style={{ width: 56 }}>Time</TableCell>
        <TableCell style={{ width: 34 }}>Sc.</TableCell>
        <TableCell>Set & description</TableCell>
        <TableCell style={{ width: 44 }}>D/N</TableCell>
        <TableCell style={{ width: 40 }}>Pages</TableCell>
        <TableCell style={{ width: 48 }}>Cast</TableCell>
      </TableRow>
      {sheet.schedule.map((sc) => (
        <TableRow key={sc.scene}>
          <TableCell style={{ fontWeight: 700 }}>{sc.time}</TableCell>
          <TableCell style={{ fontWeight: 800, fontSize: 11 }}>{sc.scene}</TableCell>
          <TableCell>
            <Span style={{ fontWeight: 700 }}>{`${sc.setting}. ${sc.location.toUpperCase()}`}</Span>
            <Span style={{ color: token("colors.muted") }}>{` · ${sc.description}`}</Span>
          </TableCell>
          <TableCell>
            <Span style={{ backgroundColor: dayNightColor[sc.dayNight], color: sc.dayNight === "N" ? "#ffffff" : "#111111", fontWeight: 700, fontSize: 8 }}>
              {` ${sc.dayNight} `}
            </Span>
          </TableCell>
          <TableCell>{sc.pages}</TableCell>
          <TableCell>{sc.cast.join(", ")}</TableCell>
        </TableRow>
      ))}
      <TableRow footer style={{ backgroundColor: token("colors.panel") }}>
        <TableCell colSpan={4} style={{ fontWeight: 700 }}>
          {`Total: ${sheet.schedule.length} scenes`}
        </TableCell>
        <TableCell style={{ fontWeight: 700 }}>{formatEighths(totalEighths)}</TableCell>
        <TableCell>{""}</TableCell>
      </TableRow>
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
