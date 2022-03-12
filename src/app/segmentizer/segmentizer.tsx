import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Note as RawNote } from "midi-segmentizer";
import Midi from "midi-segmentizer/dist/midi";
import {
  getBeatLength,
  getSegmentOffset,
  shiftMidi,
} from "midi-segmentizer/dist/helpers";

import { base64ToArrayBuffer } from "../../common/helpers";
import { useKeyPress } from "../../hooks/use-key-press";
import { useCreateArrangementMutation } from "../../generated";
import { useQueryParams } from "../../hooks/use-query-params";
import AudioDropzone from "../small-components/audio-dropzone";
import { toBase64 } from "../../utils";
import { Spinner } from "../../components/spinner";
import { useHistory } from "react-router-dom";

const X_EXPAND = 100;

type Coord = { x: number; y: number };

interface Note extends RawNote, Coord {
  width: number;
  height: number;
  topLeft: Coord;
  bottomRight: Coord;
  selected: boolean;
  offset: number;
}

function buildNote(
  note: RawNote & { selected?: boolean; offset?: number }
): Note {
  // NOTE: offset is a unit of time
  const height = 1000 / 127;
  const noteStart = note.time;
  const width = note.duration * X_EXPAND;
  const offset = note.offset ?? 0;
  const x = noteStart * X_EXPAND + offset * X_EXPAND;
  const y = (127 - note.midi) * height;
  const topLeft = { x, y };
  const bottomRight = { x: x + width, y: y + height };
  return {
    ...note,
    x,
    y,
    width,
    height,
    topLeft,
    bottomRight,
    offset,
    selected: note.selected ?? false,
  };
}

interface Segment {
  id: string;
  notes: Note[];
  color: string;
  offset: number;
}

function getBars(beatLength: number, width: number): number[] {
  const res = [];
  let i = 0;
  while (i <= width) {
    res.push(i);
    i += beatLength;
  }
  return res;
}

function renderBars(ctx: Canvas, bars: number[], height: number) {
  for (const bar of bars) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    const x = bar * X_EXPAND;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

type Canvas = CanvasRenderingContext2D;

function getRandomColor() {
  const rand = () => Math.floor(Math.random() * 255);
  return `rgb(${rand()}, ${rand()}, ${rand()})`;
}

function renderNote(ctx: Canvas, note: Note, color?: string) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color ?? "#000000";
  ctx.rect(note.x, note.y, note.width, note.height);
  ctx.stroke();
  if (note.selected) {
    ctx.fillStyle = color ?? "#000000";
    ctx.fill();
  }
}

function renderBox(
  ctx: Canvas,
  hi: number,
  lo: number,
  l: number,
  r: number,
  col: string
) {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = col;
  ctx.rect(l, hi, r - l, lo - hi);
  ctx.stroke();
}

function renderSegments(ctx: Canvas, segments: Segment[]) {
  for (const segment of segments) {
    renderSegment(ctx, segment);
  }
}

function renderSegment(ctx: Canvas, segment: Segment) {
  let hi = Infinity;
  let lo = -Infinity;
  let right = -Infinity;
  for (const note of segment.notes) {
    renderNote(ctx, note, segment.color);
    hi = Math.min(hi, note.topLeft.y);
    lo = Math.max(lo, note.bottomRight.y);
    right = Math.max(right, note.bottomRight.x);
  }
  const left = segment.offset * X_EXPAND;
  renderBox(ctx, hi, lo, left, right, segment.color);
}

function renderNotes(ctx: Canvas, notes: Note[]) {
  for (const note of notes) {
    renderNote(ctx, note);
  }
}

function clear(ctx: Canvas, w: number, h: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
}

function Segmentizer() {
  const ref = useRef(null);
  const [data, setData] = useState<string | null>(null);
  const [height, setHeight] = useState(800);
  const [width, setWidth] = useState(2000);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bpm, setBpm] = useState<number | null>();
  const [bars, setBars] = useState<number[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [mouseDown, setMouseDown] = useState<Coord | null>(null);
  const [beatLength, setBeatLength] = useState<number | null>(null);
  const [shift, setShift] = useState<number | null>(null);
  const [name, setName] = useState("");
  const escapePressed = useKeyPress("Escape");
  const tickPressed = useKeyPress("`");
  const [create, { loading }] = useCreateArrangementMutation();
  const { params } = useQueryParams();
  const pieceId = params.get("pieceId");
  const history = useHistory();

  useEffect(() => {
    if (escapePressed) {
      handleClearSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escapePressed]);

  useEffect(() => {
    if (tickPressed) {
      handleSaveSegment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickPressed]);

  useEffect(() => {
    if (data) {
      const buffer = base64ToArrayBuffer(data);
      const midi = Midi.fromBuffer(buffer);
      if (midi) {
        const _beatLength = getBeatLength(midi.simpleBpm);
        const _shift = _beatLength * 2;
        shiftMidi(midi, _shift);
        const notes = midi
          .getAllNotes()
          .map(buildNote)
          .sort((a, b) => (b.time > a.time ? -1 : 1));
        const maxWidth = Math.max(...notes.map((n) => n.x)) + 300;
        setBpm(midi.simpleBpm);
        setBars(getBars(_beatLength, maxWidth));
        setWidth(maxWidth);
        setBeatLength(_beatLength);
        setShift(_shift);
        setTimeout(() => {
          // dumb hack to get rid of weird canvas dimension change display issue
          setNotes(notes);
        }, 100);
      }
    }
  }, [data, ref]);

  if (loading) {
    return <Spinner />;
  }

  if (!pieceId) {
    return <p>need a piece id...</p>;
  }

  if (!data) {
    return (
      <AudioDropzone
        onFiles={async (files) => {
          if (files.length === 1) {
            const base64 = await toBase64(files[0]);
            setData(base64.replace("data:audio/midi;base64,", ""));
          }
        }}
      />
    );
  }

  function handleMouseDown(evt: any) {
    if (ref.current) {
      const rect = (ref.current as any).getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      setMouseDown({ x, y });
    }
  }

  function handleClearSelection() {
    setNotes(
      notes.map((note) => ({
        ...note,
        selected: false,
      }))
    );
  }

  function handleSaveSegment() {
    const remaining: Note[] = [];
    const segmentNotes: Note[] = [];
    notes.forEach((note) => {
      if (note.selected) {
        segmentNotes.push(note);
      } else {
        remaining.push(note);
      }
    });
    setNotes(remaining);

    if (segmentNotes.length && beatLength && shift) {
      const color = getRandomColor();
      const offset = getSegmentOffset(segmentNotes[0].time, beatLength, shift);
      const shiftedNotes = segmentNotes.map((n) =>
        // TODO: it's not the most intuitive thing to pass down offset at note level
        buildNote({ ...n, time: n.time - offset, offset })
      );
      setSegments([
        ...segments,
        { id: uuidv4(), color, notes: shiftedNotes, offset },
      ]);
    }
  }

  function handleMouseUp(evt: any) {
    if (ref.current && mouseDown) {
      const rect = (ref.current as any).getBoundingClientRect();
      const x = evt.clientX - rect.left;
      const y = evt.clientY - rect.top;
      const left = Math.min(x, mouseDown.x);
      const right = Math.max(x, mouseDown.x);
      const top = Math.min(y, mouseDown.y);
      const bottom = Math.max(y, mouseDown.y);
      setMouseDown(null);
      setNotes(
        notes.map((note) => {
          const { x: noteX, y: noteY, width, height } = note;
          let clicked = false;
          if (
            noteX + width >= left &&
            noteX <= right &&
            noteY + height >= top &&
            noteY <= bottom
          ) {
            clicked = true;
          }
          return {
            ...note,
            selected: clicked ? !note.selected : note.selected,
          };
        })
      );
    }
  }

  if (ref.current && notes) {
    const current = ref.current as any;
    const ctx: CanvasRenderingContext2D = current.getContext("2d");
    clear(ctx, width, height);
    renderNotes(ctx, notes);
    renderBars(ctx, bars, height);
    renderSegments(ctx, segments);
  }

  function deleteSegment(segment: Segment) {
    if (segments.find((s) => s.id === segment.id)) {
      setSegments(segments.filter((s) => s.id !== segment.id));
      setNotes([
        ...notes,
        ...segment.notes.map((note) => ({
          ...note,
          time: note.offset + note.time,
          selected: false,
          offset: 0,
        })),
      ]);
    }
  }

  function renderButtons() {
    return (
      <div style={{ position: "fixed", maxWidth: "800px" }}>
        {segments.map((segment) => (
          <button
            key={segment.id}
            onClick={() => deleteSegment(segment)}
            style={{
              backgroundColor: segment.color,
              color: "#FFFFFF",
            }}
          >
            delete
          </button>
        ))}
      </div>
    );
  }

  function handleCreate() {
    create({
      variables: {
        name,
        pieceId: pieceId!,
        segments: segments.map((segment) => ({
          bpm: bpm!,
          offset: segment.offset,
          notes: segment.notes.map((note) => ({
            time: note.time,
            midi: note.midi,
            duration: note.duration,
            velocity: 1,
            lyric: null, // TODO: fix
          })),
        })),
      },
    }).then(({ data }) => {
      const arrangementId = data?.createArrangement?.id;
      if (arrangementId) {
        history.push(`/arrangements/${arrangementId}`);
      }
    });
  }

  return (
    <div>
      <div style={{ position: "fixed" }}>
        <button onClick={handleSaveSegment}>make segment</button>
        <input onChange={(e) => setName(e.target.value)} value={name} />
        <button disabled={!segments.length || !name} onClick={handleCreate}>
          save arrangement
        </button>
      </div>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        id="react-midiVisualizer-canvas"
        ref={ref}
        height={height}
        width={width}
      />
      {renderButtons()}
    </div>
  );
}

export default Segmentizer;
