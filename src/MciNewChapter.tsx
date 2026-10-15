import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {Audio} from '@remotion/media';

const C = {
  navy: '#102B40',
  navy2: '#173A55',
  navy3: '#1F4D6C',
  cyan: '#2AA9D6',
  cyanSoft: '#78C7E3',
  white: '#F7FBFD',
  paper: '#F6F7F4',
  graphite: '#D6E1E7',
  ink: '#0E2431',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const fadeWindow = (frame:number, start:number, end:number, fade=8) =>
  Math.min(
    interpolate(frame,[start,start+fade],[0,1],clamp),
    interpolate(frame,[end-fade,end],[1,0],clamp)
  );

const BlueprintBackground: React.FC<{frame:number}> = ({frame}) => {
  const drift = interpolate(frame,[0,390],[0,18],clamp);
  return (
    <AbsoluteFill style={{background:C.navy,overflow:'hidden'}}>
      <div style={{
        position:'absolute',inset:0,
        background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 56%, ${C.navy3} 100%)`
      }}/>
      <div style={{
        position:'absolute',inset:-80,
        opacity:.028,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.26) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.26) 1px,transparent 1px)',
        backgroundSize:'86px 86px',
        transform:`translateY(${drift}px)`
      }}/>
      <div style={{
        position:'absolute',left:54,top:0,bottom:0,width:2,
        background:C.cyan,opacity:.52
      }}/>
    </AbsoluteFill>
  );
};

const DrawPath: React.FC<{
  d:string;
  progress:number;
  stroke?:string;
  width?:number;
  opacity?:number;
}> = ({d,progress,stroke=C.cyan,width=3,opacity=1}) => (
  <path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    opacity={opacity}
    pathLength={1}
    strokeDasharray={1}
    strokeDashoffset={1-progress}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const WriteText: React.FC<{
  frame:number;
  start:number;
  text:string;
  left:number;
  top:number;
  fontSize:number;
  color?:string;
  letterSpacing?:number;
  boxWidth?:number;
  revealPadding?:number;
  fontWeight?:number;
}> = ({
  frame,start,text,left,top,fontSize,color=C.white,letterSpacing=0,
  boxWidth=980,revealPadding=90,fontWeight=900
}) => {
  const p = interpolate(frame,[start,start+18],[0,1],clamp);
  const outlineOpacity = interpolate(frame,[start-4,start+4,start+24],[0,.28,.07],clamp);
  const fillOpacity = interpolate(frame,[start,start+5],[0,1],clamp);
  const revealWidth = boxWidth + revealPadding;

  return (
    <>
      {/* Ghost construction outline. Wide enough that the final glyph can never be clipped. */}
      <div style={{
        position:'absolute',left,top,width:revealWidth,
        fontFamily:'Arial,Helvetica,sans-serif',
        fontSize,fontWeight,letterSpacing,lineHeight:.88,
        color:'transparent',
        WebkitTextStroke:`1.5px rgba(214,225,231,${outlineOpacity})`,
        whiteSpace:'nowrap',
        overflow:'visible',
      }}>{text}</div>

      {/* Fill reveal uses a generously padded box to prevent CHAPTER / DESIGNER clipping. */}
      <div style={{
        position:'absolute',left,top,width:revealWidth,
        fontFamily:'Arial,Helvetica,sans-serif',
        fontSize,fontWeight,letterSpacing,lineHeight:.88,
        color,whiteSpace:'nowrap',
        opacity:fillOpacity,
        clipPath:`inset(0 ${100-p*100}% 0 0)`,
        overflow:'visible',
      }}>{text}</div>

      {/* Stylus cursor, visually subtle. */}
      {frame >= start-2 && frame <= start+20 ? (
        <div style={{
          position:'absolute',
          left:left + (boxWidth-8)*p,
          top:top-5,
          width:2.5,
          height:fontSize*.96,
          background:'rgba(214,225,231,.46)',
          transform:'rotate(2deg)',
          opacity:interpolate(frame,[start-2,start+3,start+19,start+21],[0,.72,.55,0],clamp)
        }}/>
      ):null}
    </>
  );
};

const NewChapter: React.FC<{frame:number}> = ({frame}) => {
  const opacity = fadeWindow(frame,0,72,7);
  const lineP = interpolate(frame,[8,38],[0,1],clamp);
  const aNew = interpolate(frame,[4,19],[0,1],clamp);

  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{
        position:'absolute',left:78,top:205,
        fontFamily:'Arial,Helvetica,sans-serif',
        fontSize:42,fontWeight:700,letterSpacing:12,
        color:C.cyan,
        opacity:aNew,
        clipPath:`inset(0 ${100-aNew*100}% 0 0)`
      }}>A NEW</div>

      <WriteText
        frame={frame}
        start={16}
        text="CHAPTER"
        left={72}
        top={330}
        fontSize={184}
        boxWidth={940}
        revealPadding={120}
        letterSpacing={-10}
      />

      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath d="M 82 570 L 770 570" progress={lineP} width={4}/>
      </svg>
    </AbsoluteFill>
  );
};

const RevealWord: React.FC<{
  frame:number;
  start:number;
  text:string;
  color?:string;
  lineProgress:number;
}> = ({frame,start,text,color=C.white,lineProgress}) => {
  const p = interpolate(frame,[start,start+18],[0,1],clamp);
  return (
    <div style={{
      position:'relative',
      width:'max-content',
      fontFamily:'Arial,Helvetica,sans-serif',
      fontWeight:900,
      fontSize:72,
      letterSpacing:-2.8,
      lineHeight:1,
      color,
      whiteSpace:'nowrap'
    }}>
      <div style={{
        clipPath:`inset(0 ${100-p*100}% 0 0)`
      }}>{text}</div>
      <div style={{
        width:'100%',
        height:2,
        marginTop:20,
        background:C.graphite,
        opacity:.32,
        transform:`scaleX(${lineProgress})`,
        transformOrigin:'left center'
      }}/>
    </div>
  );
};

const PeopleDataAI: React.FC<{frame:number}> = ({frame}) => {
  const opacity = fadeWindow(frame,58,202,8);

  const pPeople = interpolate(frame,[68,89],[0,1],clamp);
  const pData = interpolate(frame,[96,117],[0,1],clamp);
  const pAI = interpolate(frame,[124,145],[0,1],clamp);
  const lock = interpolate(frame,[150,174],[0,1],clamp);
  const handoff = interpolate(frame,[184,202],[0,1],clamp);

  return (
    <AbsoluteFill style={{
      opacity,
      transform:`translateY(${interpolate(handoff,[0,1],[0,-22],clamp)}px)`
    }}>
      {/* Clean, fixed-grid layout: stable baseline and balanced spacing. */}
      <div style={{
        position:'absolute',
        left:70,right:70,top:418,
        display:'grid',
        gridTemplateColumns:'2.15fr .34fr 1.55fr .34fr .68fr',
        columnGap:22,
        alignItems:'center'
      }}>
        <RevealWord frame={frame} start={68} text="PEOPLE" lineProgress={pPeople}/>
        <div style={{
          fontFamily:'Arial,Helvetica,sans-serif',
          fontSize:50,fontWeight:850,color:C.cyan,textAlign:'center',
          opacity:interpolate(frame,[84,94],[0,1],clamp)
        }}>×</div>
        <RevealWord frame={frame} start={96} text="DATA" lineProgress={pData}/>
        <div style={{
          fontFamily:'Arial,Helvetica,sans-serif',
          fontSize:50,fontWeight:850,color:C.cyan,textAlign:'center',
          opacity:interpolate(frame,[112,122],[0,1],clamp)
        }}>×</div>
        <RevealWord frame={frame} start={124} text="AI" lineProgress={pAI}/>
      </div>

      {/* Individual construction rules, aligned to the text grid. */}
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>

        {/* Final unified lock-up line */}
        <DrawPath d="M 72 552 L 1005 552" progress={lock} width={3}/>
      </svg>

      {frame >= 150 && frame <= 176 ? (
        <div style={{
          position:'absolute',
          left:72 + (1005-72)*lock - 5,
          top:545,
          width:10,height:10,borderRadius:999,
          background:C.graphite,
          opacity:interpolate(frame,[150,155,173,177],[0,.60,.52,0],clamp)
        }}/>
      ):null}
    </AbsoluteFill>
  );
};

const Convergence: React.FC<{frame:number}> = ({frame}) => {
  const opacity = interpolate(frame,[176,190,220,228],[0,1,1,0],clamp);
  const p1 = interpolate(frame,[180,207],[0,1],clamp);
  const p2 = interpolate(frame,[187,214],[0,1],clamp);
  const axis = interpolate(frame,[202,224],[0,1],clamp);
  const ring = interpolate(frame,[207,220],[0,1],clamp);

  return (
    <AbsoluteFill style={{opacity}}>
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        {/* Three deliberate, symmetrical input paths */}
        <DrawPath d="M 206 554 C 295 607, 382 646, 505 690" progress={p1} stroke={C.graphite} width={2.5} opacity={.52}/>
        <DrawPath d="M 540 554 C 540 600, 540 646, 540 690" progress={p1} stroke={C.cyanSoft} width={3} opacity={.76}/>
        <DrawPath d="M 875 554 C 786 607, 698 646, 575 690" progress={p1} stroke={C.graphite} width={2.5} opacity={.52}/>

        {/* Merge into a single constructed spine */}
        <DrawPath d="M 505 690 Q 540 713 575 690" progress={p2} stroke={C.cyan} width={3.5} opacity={.92}/>
        <DrawPath d="M 540 710 L 540 776" progress={p2} stroke={C.cyan} width={3.5} opacity={.92}/>

        {/* The convergence resolves into a horizontal construction axis for the role scene */}
        <DrawPath d="M 420 790 L 660 790" progress={axis} stroke={C.cyanSoft} width={2.5} opacity={.72}/>

        {/* Blueprint node, cleaner than the previous simple dot */}
        <circle
          cx="540"
          cy="710"
          r={interpolate(ring,[0,1],[0,15],clamp)}
          fill="none"
          stroke={C.cyan}
          strokeWidth="2"
          opacity={interpolate(ring,[0,1],[0,.82],clamp)}
        />
        <circle
          cx="540"
          cy="710"
          r={interpolate(ring,[0,1],[0,4.5],clamp)}
          fill={C.cyan}
          opacity={interpolate(ring,[0,1],[0,.92],clamp)}
        />
      </svg>
    </AbsoluteFill>
  );
};

const RoleReveal: React.FC<{frame:number}> = ({frame}) => {
  const start = 204;
  const local = Math.max(0,frame-start);
  const opacity = fadeWindow(frame,198,341,8);

  const stage = spring({
    frame:local,
    fps:30,
    config:{damping:21,stiffness:115,mass:.90}
  });

  const stageY = interpolate(stage,[0,1],[38,0],clamp);

  return (
    <AbsoluteFill style={{
      opacity,
      transform:`translateY(${stageY}px)`
    }}>
      <WriteText
        frame={frame}
        start={210}
        text="EMPLOYEE"
        left={66}
        top={315}
        fontSize={148}
        boxWidth={900}
        revealPadding={100}
        letterSpacing={-7}
      />
      <WriteText
        frame={frame}
        start={226}
        text="EXPERIENCE"
        left={66}
        top={458}
        fontSize={132}
        boxWidth={950}
        revealPadding={110}
        letterSpacing={-7}
      />
      <WriteText
        frame={frame}
        start={246}
        text="DESIGNER"
        left={66}
        top={606}
        fontSize={166}
        boxWidth={965}
        revealPadding={120}
        color={C.cyan}
        letterSpacing={-7}
      />

      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath
          d="M 68 842 L 770 842"
          progress={interpolate(frame,[252,284],[0,1],clamp)}
          width={4}
        />
      </svg>
    </AbsoluteFill>
  );
};

const LogoOutro: React.FC<{frame:number}> = ({frame}) => {
  const start = 315;
  const local = Math.max(0,frame-start);
  const paper = interpolate(local,[16,50],[0,1],clamp);
  const logo = spring({
    frame:Math.max(0,local-44),
    fps:30,
    config:{damping:18,stiffness:115,mass:.82}
  });
  const logoOpacity = interpolate(local,[46,64],[0,1],clamp);

  return (
    <AbsoluteFill style={{overflow:'hidden'}}>
      <AbsoluteFill style={{background:C.navy2}}/>

      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath
          d="M -60 400 C 230 270, 420 320, 610 420 C 815 528, 970 475, 1150 350"
          progress={interpolate(local,[0,30],[0,1],clamp)}
          stroke={C.cyanSoft}
          width={4}
          opacity={.74}
        />
        <DrawPath
          d="M -60 470 C 220 350, 430 375, 625 470 C 815 565, 985 530, 1160 410"
          progress={interpolate(local,[7,37],[0,1],clamp)}
          stroke={C.cyan}
          width={3}
          opacity={.60}
        />
      </svg>

      <div style={{
        position:'absolute',left:0,right:0,bottom:0,
        height:`${paper*100}%`,
        background:C.paper,
        borderTop:paper>.01?`3px solid ${C.cyan}`:'none'
      }}/>

      <div style={{
        position:'absolute',inset:0,
        display:'flex',alignItems:'center',justifyContent:'center',
        opacity:logoOpacity,
        transform:`translateY(${interpolate(logo,[0,1],[30,0],clamp)}px) scale(${interpolate(logo,[0,1],[.96,1],clamp)})`
      }}>
        <Img src={staticFile('logo-mci-02.svg')} style={{width:450,height:182,objectFit:'contain'}}/>
      </div>
    </AbsoluteFill>
  );
};

export const MciNewChapter: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background:C.navy,overflow:'hidden'}}>
      <Audio src={staticFile('mci-new-chapter-sound.mp3')} volume={1}/>
      <BlueprintBackground frame={frame}/>
      {frame < 72 ? <NewChapter frame={frame}/> : null}
      {frame >= 58 && frame < 202 ? <PeopleDataAI frame={frame}/> : null}
      {frame >= 176 && frame < 228 ? <Convergence frame={frame}/> : null}
      {frame >= 198 && frame < 341 ? <RoleReveal frame={frame}/> : null}
      {frame >= 315 ? <LogoOutro frame={frame}/> : null}
    </AbsoluteFill>
  );
};
