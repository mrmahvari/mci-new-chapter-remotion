import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const palette = {
  cream: '#F5F3E9',
  cream2: '#EEEDE1',
  pistachio: '#D8E2D0',
  sage: '#A9B9A0',
  sageDeep: '#617665',
  ink: '#1D2924',
  gold: '#B9A06E',
  white: '#FFFDF7',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.bezier(0.2, 0.85, 0.2, 1);

const fadeWindow = (frame: number, start: number, end: number, fade = 10) => {
  const fadeIn = interpolate(frame, [start, start + fade], [0, 1], clamp);
  const fadeOut = interpolate(frame, [end - fade, end], [1, 0], clamp);
  return Math.min(fadeIn, fadeOut);
};

const OrganicBackdrop: React.FC<{frame: number}> = ({frame}) => {
  const drift = interpolate(frame, [0, 450], [-18, 26], clamp);
  const drift2 = interpolate(frame, [0, 450], [14, -20], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: palette.cream}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 78% 10%, rgba(255,255,255,0.88), transparent 36%), linear-gradient(135deg, #F8F5EA 0%, #EEF1E4 52%, #F5F0E2 100%)',
        }}
      />

      <svg
        viewBox="0 0 1080 1350"
        width="1080"
        height="1350"
        style={{position: 'absolute', inset: 0}}
      >
        <g transform={`translate(${drift} 0)`} opacity="0.78">
          <path
            d="M-140 390 C 120 215, 325 235, 505 380 C 670 512, 795 520, 1210 265 L 1210 760 C 970 865, 690 760, 470 645 C 245 530, 40 560,-140 690 Z"
            fill={palette.pistachio}
          />
          <path
            d="M-180 600 C 75 470, 305 470, 520 610 C 730 745, 900 700, 1220 505 L 1220 930 C 985 1030, 750 982, 500 860 C 230 728, 42 748,-180 875 Z"
            fill="#C6D3BD"
            opacity="0.52"
          />
        </g>

        <g transform={`translate(${drift2} 0)`} fill="none">
          <path
            d="M-100 285 C 170 140, 325 295, 520 475 C 735 674, 905 595, 1175 370"
            stroke={palette.sageDeep}
            strokeWidth="2"
            opacity="0.38"
          />
          <path
            d="M-160 490 C 135 315, 320 430, 510 595 C 730 785, 905 720, 1190 515"
            stroke={palette.white}
            strokeWidth="3"
            opacity="0.72"
          />
          <path
            d="M-120 820 C 190 665, 370 710, 585 825 C 795 937, 970 890, 1200 745"
            stroke={palette.gold}
            strokeWidth="1.8"
            opacity="0.30"
          />
        </g>

        <g opacity="0.7">
          <circle cx="170" cy="245" r="8" fill={palette.sageDeep} />
          <circle cx="575" cy="805" r="7" fill={palette.sageDeep} />
          <circle cx="865" cy="870" r="7" fill={palette.gold} />
        </g>

        <circle cx="-110" cy="215" r="335" fill="none" stroke={palette.sageDeep} strokeWidth="2" opacity="0.18" />
        <circle cx="1140" cy="240" r="300" fill="none" stroke={palette.sage} strokeWidth="2" opacity="0.20" />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.065,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E")',
        }}
      />
    </AbsoluteFill>
  );
};

const Center: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 90px',
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

const NewChapter: React.FC<{frame: number}> = ({frame}) => {
  const local = frame;
  const enter = spring({frame: local, fps: 30, config: {damping: 18, stiffness: 135}});
  const opacity = fadeWindow(frame, 0, 82, 12);
  const tracking = interpolate(enter, [0, 1], [22, 7], clamp);
  const y = interpolate(enter, [0, 1], [38, 0], clamp);

  return (
    <Center style={{opacity}}>
      <div
        style={{
          transform: `translateY(${y}px)`,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: tracking,
          color: palette.ink,
          textAlign: 'center',
          lineHeight: 1.05,
        }}
      >
        A NEW CHAPTER
      </div>
      <div
        style={{
          width: interpolate(enter, [0, 1], [0, 420], clamp),
          height: 3,
          borderRadius: 999,
          marginTop: 32,
          background: `linear-gradient(90deg, ${palette.sageDeep}, ${palette.gold})`,
          opacity: 0.7,
        }}
      />
    </Center>
  );
};

const EmployeeExperience: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeWindow(frame, 66, 176, 12);
  const local = Math.max(0, frame - 66);
  const p1 = spring({frame: local, fps: 30, config: {damping: 16, stiffness: 125}});
  const p2 = spring({frame: Math.max(0, local - 6), fps: 30, config: {damping: 16, stiffness: 125}});
  const x1 = interpolate(p1, [0, 1], [-155, 0], clamp);
  const x2 = interpolate(p2, [0, 1], [165, 0], clamp);

  return (
    <Center style={{opacity}}>
      <div style={{width: '100%', textAlign: 'center', fontFamily: 'Arial, Helvetica, sans-serif'}}>
        <div
          style={{
            transform: `translateX(${x1}px)`,
            fontSize: 112,
            lineHeight: 0.95,
            fontWeight: 750,
            letterSpacing: 4,
            color: palette.ink,
          }}
        >
          EMPLOYEE
        </div>
        <div
          style={{
            transform: `translateX(${x2}px)`,
            marginTop: 18,
            fontSize: 112,
            lineHeight: 0.95,
            fontWeight: 750,
            letterSpacing: 4,
            color: palette.sageDeep,
          }}
        >
          EXPERIENCE
        </div>
      </div>
    </Center>
  );
};

const PeopleDataAI: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeWindow(frame, 158, 282, 12);
  const local = Math.max(0, frame - 158);
  const p = spring({frame: local, fps: 30, config: {damping: 18, stiffness: 115}});
  const scale = interpolate(p, [0, 1], [0.93, 1], clamp);

  const emphasis = (start: number) =>
    interpolate(frame, [start, start + 10, start + 26], [0.6, 1, 0.78], clamp);

  return (
    <Center style={{opacity}}>
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 26,
          width: '100%',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: 3,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: palette.ink, opacity: emphasis(176)}}>PEOPLE</span>
        <span style={{color: '#707A73', fontWeight: 400}}>×</span>
        <span style={{color: palette.sageDeep, opacity: emphasis(202)}}>DATA</span>
        <span style={{color: '#707A73', fontWeight: 400}}>×</span>
        <span style={{color: palette.gold, opacity: emphasis(228)}}>AI</span>
      </div>
      <div
        style={{
          marginTop: 34,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 31,
          letterSpacing: 1,
          color: palette.ink,
          opacity: 0.62,
        }}
      >
        People insights. Better experiences. Smarter decisions.
      </div>
    </Center>
  );
};

const CompanyReveal: React.FC<{frame: number}> = ({frame}) => {
  const opacity = fadeWindow(frame, 266, 366, 12);
  const local = Math.max(0, frame - 266);
  const enter = spring({frame: local, fps: 30, config: {damping: 20, stiffness: 105}});
  const y = interpolate(enter, [0, 1], [42, 0], clamp);

  return (
    <Center style={{opacity}}>
      <div
        style={{
          transform: `translateY(${y}px)`,
          textAlign: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
          color: palette.ink,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 730,
            letterSpacing: 1.2,
          }}
        >
          Hamrah Aval (MCI)
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 41,
            fontWeight: 500,
            letterSpacing: 0.8,
            color: palette.sageDeep,
          }}
        >
          Employee Experience Designer
        </div>
      </div>
    </Center>
  );
};

const FinalLogo: React.FC<{frame: number}> = ({frame}) => {
  const local = Math.max(0, frame - 344);
  const enter = spring({frame: local, fps: 30, config: {damping: 18, stiffness: 105}});
  const scale = interpolate(enter, [0, 1], [0.82, 1], clamp);
  const opacity = interpolate(frame, [344, 362], [0, 1], clamp);
  const line = interpolate(frame, [366, 404], [0, 520], clamp);

  return (
    <Center style={{opacity}}>
      <div
        style={{
          transform: `scale(${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            padding: '30px 54px',
            borderRadius: 30,
            background: 'rgba(255,253,247,0.54)',
            boxShadow: '0 18px 60px rgba(38,55,45,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Img
            src={staticFile('logo-mci-02.svg')}
            style={{
              width: 360,
              height: 150,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 42,
            fontWeight: 650,
            color: palette.ink,
            letterSpacing: 0.5,
          }}
        >
          Employee Experience Designer
        </div>

        <div
          style={{
            width: line,
            height: 2,
            marginTop: 27,
            background: `linear-gradient(90deg, transparent, ${palette.sageDeep}, ${palette.gold}, transparent)`,
          }}
        />

        <div
          style={{
            marginTop: 24,
            fontSize: 31,
            fontWeight: 650,
            letterSpacing: 3,
            color: palette.sageDeep,
          }}
        >
          PEOPLE × DATA × AI
        </div>
      </div>
    </Center>
  );
};

export const MciNewChapter: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <OrganicBackdrop frame={frame} />

      {frame < 82 ? <NewChapter frame={frame} /> : null}
      {frame >= 66 && frame < 176 ? <EmployeeExperience frame={frame} /> : null}
      {frame >= 158 && frame < 282 ? <PeopleDataAI frame={frame} /> : null}
      {frame >= 266 && frame < 366 ? <CompanyReveal frame={frame} /> : null}
      {frame >= 344 ? <FinalLogo frame={frame} /> : null}
    </AbsoluteFill>
  );
};
