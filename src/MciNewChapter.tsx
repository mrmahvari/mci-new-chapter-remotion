import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const C = {
  blue0: '#102B40',
  blue1: '#173A55',
  blue2: '#1F4D6C',
  cyan: '#2AA9D6',
  cyanSoft: '#78C7E3',
  white: '#F7FBFD',
  muted: '#B7C8D4',
  paper: '#F6F7F4',
  ink: '#10222D',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const sceneOpacity = (frame: number, start: number, end: number, fade = 7) =>
  Math.min(
    interpolate(frame, [start, start + fade], [0, 1], clamp),
    interpolate(frame, [end - fade, end], [1, 0], clamp),
  );

const Background: React.FC<{frame: number}> = ({frame}) => {
  const light = interpolate(frame, [0, 285], [0, 1], clamp);
  const gridOpacity = interpolate(frame, [0, 285], [0.065, 0.022], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.blue0}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg,
            ${C.blue0} 0%,
            ${C.blue1} ${46 - light * 5}%,
            ${C.blue2} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: -60,
          opacity: gridOpacity,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          transform: `translateY(${interpolate(frame, [0, 300], [0, 20], clamp)}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 0,
          bottom: 0,
          width: 2,
          background: C.cyan,
          opacity: 0.64,
          transform: `scaleY(${interpolate(frame, [0, 20], [0, 1], clamp)})`,
          transformOrigin: 'top',
        }}
      />
    </AbsoluteFill>
  );
};

const SceneOne: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 0, 58, 6);
  const p = spring({frame, fps: 30, config: {damping: 19, stiffness: 165, mass: 0.72}});
  const p2 = spring({
    frame: Math.max(0, frame - 7),
    fps: 30,
    config: {damping: 18, stiffness: 155, mass: 0.75},
  });

  return (
    <AbsoluteFill style={{opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 194,
          color: C.cyan,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 750,
          fontSize: 46,
          letterSpacing: 11,
          transform: `translateY(${interpolate(p, [0, 1], [44, 0], clamp)}px)`,
          clipPath: `inset(${interpolate(p, [0, 1], [100, 0], clamp)}% 0 0 0)`,
        }}
      >
        A NEW
      </div>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 330,
          width: 1200,
          color: C.white,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: 184,
          letterSpacing: -10,
          lineHeight: 0.84,
          whiteSpace: 'nowrap',
          transform: `translateX(${interpolate(p2, [0, 1], [-155, 0], clamp)}px)`,
          clipPath: `inset(0 ${interpolate(p2, [0, 1], [100, 0], clamp)}% 0 0)`,
        }}
      >
        CHAPTER
      </div>
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 568,
          height: 4,
          width: interpolate(frame, [13, 38], [0, 735], clamp),
          background: C.cyan,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneTwo: React.FC<{frame: number}> = ({frame}) => {
  const start = 44;
  const local = Math.max(0, frame - start);
  const opacity = sceneOpacity(frame, 44, 130, 7);
  const p1 = spring({frame: local, fps: 30, config: {damping: 20, stiffness: 165, mass: 0.7}});
  const p2 = spring({
    frame: Math.max(0, local - 6),
    fps: 30,
    config: {damping: 19, stiffness: 160, mass: 0.72},
  });

  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 250,
          color: C.white,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: 142,
          letterSpacing: -6,
          lineHeight: 0.86,
          transform: `translateX(${interpolate(p1, [0, 1], [240, 0], clamp)}px)`,
          clipPath: `inset(0 0 0 ${interpolate(p1, [0, 1], [100, 0], clamp)}%)`,
        }}
      >
        EMPLOYEE
      </div>
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 402,
          color: C.cyan,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: 148,
          letterSpacing: -7,
          lineHeight: 0.84,
          whiteSpace: 'nowrap',
          transform: `translateX(${interpolate(p2, [0, 1], [-280, 0], clamp)}px)`,
          clipPath: `inset(0 ${interpolate(p2, [0, 1], [100, 0], clamp)}% 0 0)`,
        }}
      >
        EXPERIENCE
      </div>
      <div
        style={{
          position: 'absolute',
          left: 74,
          right: 58,
          top: 612,
          color: C.muted,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 29,
          fontWeight: 650,
          letterSpacing: 2.6,
          whiteSpace: 'nowrap',
        }}
      >
        FROM EMPLOYEE VOICE TO BETTER EXPERIENCES
      </div>
    </AbsoluteFill>
  );
};

const BigWord: React.FC<{
  frame: number;
  from: number;
  to: number;
  word: string;
  color: string;
  align: 'left' | 'right';
}> = ({frame, from, to, word, color, align}) => {
  const opacity = sceneOpacity(frame, from, to, 3);
  const p = interpolate(frame, [from, from + 8], [0, 1], clamp);
  const x = align === 'left'
    ? interpolate(p, [0, 1], [-160, 0], clamp)
    : interpolate(p, [0, 1], [160, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: 286,
        left: align === 'left' ? 64 : undefined,
        right: align === 'right' ? 64 : undefined,
        color,
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontWeight: 900,
        fontSize: word === 'AI' ? 292 : 188,
        letterSpacing: word === 'AI' ? -14 : -10,
        lineHeight: 0.85,
      }}
    >
      {word}
    </div>
  );
};

const SceneThree: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 116, 196, 6);
  const lock = spring({
    frame: Math.max(0, frame - 176),
    fps: 30,
    config: {damping: 20, stiffness: 160, mass: 0.68},
  });

  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <BigWord frame={frame} from={120} to={150} word="PEOPLE" color={C.white} align="left" />
      <BigWord frame={frame} from={142} to={172} word="DATA" color={C.cyan} align="right" />
      <BigWord frame={frame} from={164} to={190} word="AI" color={C.white} align="left" />

      <div
        style={{
          position: 'absolute',
          left: 66,
          right: 66,
          top: 640,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: interpolate(frame, [180, 194], [0, 1], clamp),
          transform: `translateY(${interpolate(lock, [0, 1], [22, 0], clamp)}px)`,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: 1.2,
        }}
      >
        <span style={{color: C.white}}>PEOPLE</span>
        <span style={{color: C.cyan}}>×</span>
        <span style={{color: C.white}}>DATA</span>
        <span style={{color: C.cyan}}>×</span>
        <span style={{color: C.white}}>AI</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 66,
          right: 66,
          top: 714,
          height: 3,
          background: C.cyan,
          opacity: 0.9,
          transformOrigin: 'left',
          transform: `scaleX(${interpolate(frame, [184, 202], [0, 1], clamp)})`,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneFour: React.FC<{frame: number}> = ({frame}) => {
  const start = 188;
  const local = Math.max(0, frame - start);
  const opacity = sceneOpacity(frame, 188, 294, 6);

  const tag = spring({
    frame: Math.max(0, local),
    fps: 30,
    config: {damping: 18, stiffness: 150, mass: 0.72},
  });
  const p1 = spring({
    frame: Math.max(0, local - 6),
    fps: 30,
    config: {damping: 18, stiffness: 165, mass: 0.68},
  });
  const p2 = spring({
    frame: Math.max(0, local - 11),
    fps: 30,
    config: {damping: 18, stiffness: 160, mass: 0.7},
  });
  const p3 = spring({
    frame: Math.max(0, local - 18),
    fps: 30,
    config: {damping: 17, stiffness: 170, mass: 0.72},
  });

  return (
    <AbsoluteFill style={{opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 188,
          color: C.cyan,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 22,
          fontWeight: 750,
          letterSpacing: 7,
          opacity: interpolate(tag, [0, 1], [0, 1], clamp),
          transform: `translateY(${interpolate(tag, [0, 1], [16, 0], clamp)}px)`,
        }}
      >
        NEW ROLE AT HAMRAH AVAL (MCI)
      </div>

      {[
        ['EMPLOYEE', p1, 310, C.white, 148],
        ['EXPERIENCE', p2, 454, C.white, 132],
        ['DESIGNER', p3, 600, C.cyan, 166],
      ].map(([word, p, top, color, size]) => (
        <div
          key={word as string}
          style={{
            position: 'absolute',
            left: 66,
            top: top as number,
            color: color as string,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: size as number,
            fontWeight: 900,
            letterSpacing: -7,
            lineHeight: 0.86,
            transform: `translateX(${interpolate(p as number, [0, 1], [185, 0], clamp)}px)`,
            clipPath: `inset(0 0 0 ${interpolate(p as number, [0, 1], [100, 0], clamp)}%)`,
          }}
        >
          {word as string}
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          left: 68,
          bottom: 150,
          height: 4,
          width: interpolate(frame, [214, 250], [0, 700], clamp),
          background: C.cyan,
          opacity: 0.92,
        }}
      />
    </AbsoluteFill>
  );
};

const LogoOutro: React.FC<{frame: number}> = ({frame}) => {
  const start = 268;
  const local = Math.max(0, frame - start);
  const wipe = interpolate(local, [20, 58], [0, 1], clamp);
  const logo = spring({
    frame: Math.max(0, local - 48),
    fps: 30,
    config: {damping: 18, stiffness: 118, mass: 0.8},
  });
  const logoOpacity = interpolate(local, [50, 68], [0, 1], clamp);
  const roleOpacity = interpolate(local, [69, 84], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{background: C.blue1}} />
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position: 'absolute', inset: 0}}>
        {[
          ['M -120 410 C 190 230, 365 270, 590 390 C 790 495, 940 460, 1200 275', 0],
          ['M -120 475 C 170 315, 380 325, 605 450 C 805 560, 955 520, 1200 345', 6],
          ['M -120 540 C 160 390, 395 385, 620 505 C 825 615, 980 570, 1210 420', 12],
        ].map(([d, delay], i) => {
          const p = interpolate(local, [delay as number, (delay as number) + 34], [0, 1], clamp);
          return (
            <path
              key={i}
              d={d as string}
              fill="none"
              stroke={i === 0 ? C.cyanSoft : C.cyan}
              strokeWidth={i === 0 ? 5 : 3}
              opacity={0.9 - i * 0.14}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - p}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: `${wipe * 100}%`,
          background: C.paper,
          borderTop: wipe > 0.01 ? `3px solid ${C.cyan}` : 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          opacity: logoOpacity,
          transform: `translateY(${interpolate(logo, [0, 1], [34, 0], clamp)}px) scale(${interpolate(
            logo,
            [0, 1],
            [0.95, 1],
            clamp
          )})`,
        }}
      >
        <Img src={staticFile('logo-mci-02.svg')} style={{width: 450, height: 182, objectFit: 'contain'}} />
        <div style={{marginTop: 40, width: 68, height: 3, background: C.cyan, opacity: roleOpacity}} />
        <div
          style={{
            marginTop: 20,
            opacity: roleOpacity,
            color: C.ink,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 29,
            fontWeight: 700,
            letterSpacing: 1.15,
          }}
        >
          Employee Experience Designer
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MciNewChapter: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: C.blue0, overflow: 'hidden'}}>
      <Audio src={staticFile('mci-new-chapter-sound.wav')} volume={0.9} />
      <Background frame={frame} />
      {frame < 58 ? <SceneOne frame={frame} /> : null}
      {frame >= 44 && frame < 130 ? <SceneTwo frame={frame} /> : null}
      {frame >= 116 && frame < 196 ? <SceneThree frame={frame} /> : null}
      {frame >= 188 && frame < 294 ? <SceneFour frame={frame} /> : null}
      {frame >= 268 ? <LogoOutro frame={frame} /> : null}
    </AbsoluteFill>
  );
};
