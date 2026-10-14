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
  const drift = interpolate(frame,[0,390],[0,20],clamp);
  return (
    <AbsoluteFill style={{background:C.navy,overflow:'hidden'}}>
      <div style={{
        position:'absolute',inset:0,
        background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 56%, ${C.navy3} 100%)`
      }}/>
      <div style={{
        position:'absolute',inset:-80,
        opacity:.035,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.30) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.30) 1px,transparent 1px)',
        backgroundSize:'86px 86px',
        transform:`translateY(${drift}px)`
      }}/>
      <div style={{
        position:'absolute',left:54,top:0,bottom:0,width:2,
        background:C.cyan,opacity:.55
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
  width?:number;
  fontWeight?:number;
}> = ({
  frame,start,text,left,top,fontSize,color=C.white,letterSpacing=0,width=900,fontWeight=900
}) => {
  const p = interpolate(frame,[start,start+18],[0,1],clamp);
  const outlineOpacity = interpolate(frame,[start-4,start+4,start+24],[0,.40,.12],clamp);
  const fillOpacity = interpolate(frame,[start,start+5],[0,1],clamp);
  const pencilX = left + width * p;
  return (
    <>
      <div style={{
        position:'absolute',left,top,width,
        fontFamily:'Arial,Helvetica,sans-serif',
        fontSize,fontWeight,letterSpacing,lineHeight:.88,
        color:'transparent',
        WebkitTextStroke:`2px rgba(214,225,231,${outlineOpacity})`,
        whiteSpace:'nowrap'
      }}>{text}</div>

      <div style={{
        position:'absolute',left,top,width,
        fontFamily:'Arial,Helvetica,sans-serif',
        fontSize,fontWeight,letterSpacing,lineHeight:.88,
        color,whiteSpace:'nowrap',
        opacity:fillOpacity,
        clipPath:`inset(0 ${100-p*100}% 0 0)`
      }}>{text}</div>

      {frame >= start-2 && frame <= start+20 ? (
        <div style={{
          position:'absolute',
          left:pencilX-2,top:top-7,
          width:3,height:fontSize*.98,
          background:'rgba(214,225,231,.60)',
          transform:'rotate(2deg)',
          opacity:interpolate(frame,[start-2,start+3,start+19,start+21],[0,.9,.7,0],clamp)
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
        width={900}
        letterSpacing={-10}
      />

      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath d="M 82 570 L 770 570" progress={lineP} width={4}/>
      </svg>
    </AbsoluteFill>
  );
};

const PeopleDataAI: React.FC<{frame:number}> = ({frame}) => {
  const opacity = fadeWindow(frame,58,202,8);
  const pPeople = interpolate(frame,[68,89],[0,1],clamp);
  const pData = interpolate(frame,[96,117],[0,1],clamp);
  const pAI = interpolate(frame,[124,145],[0,1],clamp);
  const lock = interpolate(frame,[150,174],[0,1],clamp);
  const holdLift = interpolate(frame,[184,202],[0,1],clamp);

  return (
    <AbsoluteFill style={{
      opacity,
      transform:`translateY(${interpolate(holdLift,[0,1],[0,-24],clamp)}px)`
    }}>
      {/* Subtle construction guides */}
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath d="M 75 520 L 375 520" progress={pPeople} stroke={C.graphite} width={2} opacity={.38}/>
        <DrawPath d="M 390 520 L 680 520" progress={pData} stroke={C.graphite} width={2} opacity={.38}/>
        <DrawPath d="M 705 520 L 1000 520" progress={pAI} stroke={C.graphite} width={2} opacity={.38}/>
      </svg>

      <div style={{
        position:'absolute',left:62,top:435,
        fontFamily:'Arial,Helvetica,sans-serif',fontWeight:900,fontSize:78,
        color:C.white,letterSpacing:-3,
        clipPath:`inset(0 ${100-pPeople*100}% 0 0)`
      }}>PEOPLE</div>

      <div style={{
        position:'absolute',left:410,top:435,
        fontFamily:'Arial,Helvetica,sans-serif',fontWeight:900,fontSize:78,
        color:C.white,letterSpacing:-3,
        clipPath:`inset(0 ${100-pData*100}% 0 0)`
      }}>DATA</div>

      <div style={{
        position:'absolute',right:75,top:435,
        fontFamily:'Arial,Helvetica,sans-serif',fontWeight:900,fontSize:78,
        color:C.white,letterSpacing:-3,
        clipPath:`inset(0 ${100-pAI*100}% 0 0)`
      }}>AI</div>

      <div style={{
        position:'absolute',left:327,top:440,
        fontFamily:'Arial,Helvetica,sans-serif',fontSize:54,fontWeight:800,
        color:C.cyan,opacity:interpolate(frame,[84,94],[0,1],clamp)
      }}>×</div>
      <div style={{
        position:'absolute',left:660,top:440,
        fontFamily:'Arial,Helvetica,sans-serif',fontSize:54,fontWeight:800,
        color:C.cyan,opacity:interpolate(frame,[112,122],[0,1],clamp)
      }}>×</div>

      {/* Final lock-up line */}
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath d="M 66 548 L 1010 548" progress={lock} width={3}/>
      </svg>

      {/* Tiny endpoint / pencil cursor */}
      {frame >= 150 && frame <= 176 ? (
        <div style={{
          position:'absolute',
          left:66 + (1010-66)*lock - 5,
          top:541,
          width:10,height:10,borderRadius:999,
          background:C.graphite,
          opacity:interpolate(frame,[150,155,173,177],[0,.75,.70,0],clamp)
        }}/>
      ):null}
    </AbsoluteFill>
  );
};

const Convergence: React.FC<{frame:number}> = ({frame}) => {
  const opacity = interpolate(frame,[176,190,216,226],[0,1,1,0],clamp);
  const p = interpolate(frame,[180,216],[0,1],clamp);
  return (
    <AbsoluteFill style={{opacity}}>
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        <DrawPath d="M 220 548 C 315 625, 405 675, 520 728" progress={p} stroke={C.graphite} width={2.5} opacity={.65}/>
        <DrawPath d="M 540 548 L 540 728" progress={p} stroke={C.cyanSoft} width={3} opacity={.75}/>
        <DrawPath d="M 865 548 C 770 625, 675 675, 560 728" progress={p} stroke={C.graphite} width={2.5} opacity={.65}/>
        <circle cx="540" cy="730" r={interpolate(p,[0,1],[0,9],clamp)} fill={C.cyan}/>
      </svg>
    </AbsoluteFill>
  );
};

const RoleReveal: React.FC<{frame:number}> = ({frame}) => {
  const start = 204;
  const local = Math.max(0,frame-start);
  const opacity = fadeWindow(frame,198,326,8);

  const stage = spring({
    frame:local,
    fps:30,
    config:{damping:21,stiffness:115,mass:.90}
  });

  const stageY = interpolate(stage,[0,1],[42,0],clamp);
  const glow = interpolate(frame,[234,264,290],[0,.10,.04],clamp);

  return (
    <AbsoluteFill style={{
      opacity,
      transform:`translateY(${stageY}px)`
    }}>
      <div style={{
        position:'absolute',left:58,top:260,
        width:925,height:520,
        border:`1px solid rgba(120,199,227,${glow})`,
        opacity:glow>0?1:0
      }}/>

      <WriteText frame={frame} start={210} text="EMPLOYEE" left={66} top={315} fontSize={148} width={860} letterSpacing={-7}/>
      <WriteText frame={frame} start={226} text="EXPERIENCE" left={66} top={458} fontSize={132} width={930} letterSpacing={-7}/>
      <WriteText frame={frame} start={246} text="DESIGNER" left={66} top={606} fontSize={166} width={880} color={C.cyan} letterSpacing={-7}/>

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
  const start = 300;
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
        <DrawPath d="M -60 400 C 230 270, 420 320, 610 420 C 815 528, 970 475, 1150 350"
          progress={interpolate(local,[0,30],[0,1],clamp)} stroke={C.cyanSoft} width={4} opacity={.78}/>
        <DrawPath d="M -60 470 C 220 350, 430 375, 625 470 C 815 565, 985 530, 1160 410"
          progress={interpolate(local,[7,37],[0,1],clamp)} stroke={C.cyan} width={3} opacity={.65}/>
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
      <Audio src={staticFile('mci-new-chapter-sound.wav')} volume={1}/>
      <BlueprintBackground frame={frame}/>
      {frame < 72 ? <NewChapter frame={frame}/> : null}
      {frame >= 58 && frame < 202 ? <PeopleDataAI frame={frame}/> : null}
      {frame >= 176 && frame < 226 ? <Convergence frame={frame}/> : null}
      {frame >= 198 && frame < 326 ? <RoleReveal frame={frame}/> : null}
      {frame >= 300 ? <LogoOutro frame={frame}/> : null}
    </AbsoluteFill>
  );
};
