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
  cyan: '#27B6E6',
  cyanSoft: '#73D2F0',
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
  const light = interpolate(frame, [0, 270], [0, 1], clamp);
  const gridOpacity = interpolate(frame, [0, 270], [0.07, 0.025], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.blue0}}>
      <div style={{
        position:'absolute', inset:0,
        background:`linear-gradient(135deg,
          ${C.blue0} 0%,
          ${C.blue1} ${45 - light*5}%,
          ${C.blue2} 100%)`
      }}/>
      <div style={{
        position:'absolute', inset:-60, opacity:gridOpacity,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
        backgroundSize:'92px 92px',
        transform:`translateY(${interpolate(frame,[0,300],[0,24],clamp)}px)`
      }}/>
      <div style={{
        position:'absolute', left:54, top:0, bottom:0, width:2,
        background:C.cyan,
        opacity:0.68,
        transform:`scaleY(${interpolate(frame,[0,20],[0,1],clamp)})`,
        transformOrigin:'top'
      }}/>
    </AbsoluteFill>
  );
};

const SceneOne: React.FC<{frame:number}> = ({frame}) => {
  const opacity=sceneOpacity(frame,0,58,6);
  const p=spring({frame,fps:30,config:{damping:19,stiffness:165,mass:0.72}});
  const p2=spring({frame:Math.max(0,frame-7),fps:30,config:{damping:18,stiffness:155,mass:0.75}});
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{
        position:'absolute',left:82,top:180,color:C.cyan,
        fontFamily:'Arial, Helvetica, sans-serif',fontWeight:750,fontSize:46,
        letterSpacing:11,
        transform:`translateY(${interpolate(p,[0,1],[44,0],clamp)}px)`,
        clipPath:`inset(${interpolate(p,[0,1],[100,0],clamp)}% 0 0 0)`
      }}>A NEW</div>
      <div style={{
        position:'absolute',left:72,top:315,width:1200,color:C.white,
        fontFamily:'Arial, Helvetica, sans-serif',fontWeight:900,fontSize:184,
        letterSpacing:-10,lineHeight:0.84,whiteSpace:'nowrap',
        transform:`translateX(${interpolate(p2,[0,1],[-155,0],clamp)}px)`,
        clipPath:`inset(0 ${interpolate(p2,[0,1],[100,0],clamp)}% 0 0)`
      }}>CHAPTER</div>
      <div style={{
        position:'absolute',left:82,top:552,height:4,
        width:interpolate(frame,[13,38],[0,735],clamp),
        background:C.cyan
      }}/>
    </AbsoluteFill>
  );
};

const SceneTwo: React.FC<{frame:number}> = ({frame}) => {
  const start=44;
  const local=Math.max(0,frame-start);
  const opacity=sceneOpacity(frame,44,132,7);
  const p1=spring({frame:local,fps:30,config:{damping:20,stiffness:165,mass:0.7}});
  const p2=spring({frame:Math.max(0,local-6),fps:30,config:{damping:19,stiffness:160,mass:0.72}});
  return (
    <AbsoluteFill style={{opacity,overflow:'hidden'}}>
      <div style={{
        position:'absolute',left:72,top:255,color:C.white,
        fontFamily:'Arial, Helvetica, sans-serif',fontWeight:900,fontSize:142,
        letterSpacing:-6,lineHeight:0.86,
        transform:`translateX(${interpolate(p1,[0,1],[240,0],clamp)}px)`,
        clipPath:`inset(0 0 0 ${interpolate(p1,[0,1],[100,0],clamp)}%)`
      }}>EMPLOYEE</div>
      <div style={{
        position:'absolute',left:68,top:405,color:C.cyan,
        fontFamily:'Arial, Helvetica, sans-serif',fontWeight:900,fontSize:166,
        letterSpacing:-8,lineHeight:0.82,whiteSpace:'nowrap',
        transform:`translateX(${interpolate(p2,[0,1],[-280,0],clamp)}px)`,
        clipPath:`inset(0 ${interpolate(p2,[0,1],[100,0],clamp)}% 0 0)`
      }}>EXPERIENCE</div>
      <div style={{
        position:'absolute',left:76,top:628,width:740,color:C.muted,
        fontFamily:'Arial, Helvetica, sans-serif',fontSize:23,fontWeight:600,
        letterSpacing:5
      }}>FROM EMPLOYEE VOICE TO BETTER EXPERIENCES</div>
    </AbsoluteFill>
  );
};

const BigWord: React.FC<{frame:number;from:number;to:number;word:string;color:string;align:'left'|'right'}> =
({frame,from,to,word,color,align}) => {
  const opacity=sceneOpacity(frame,from,to,3);
  const p=interpolate(frame,[from,from+8],[0,1],clamp);
  const x=align==='left'?interpolate(p,[0,1],[-210,0],clamp):interpolate(p,[0,1],[210,0],clamp);
  return (
    <div style={{
      position:'absolute',top:270,
      left:align==='left'?64:undefined,right:align==='right'?64:undefined,
      color,opacity,transform:`translateX(${x}px)`,
      fontFamily:'Arial, Helvetica, sans-serif',
      fontWeight:900,fontSize:word==='AI'?350:220,
      letterSpacing:word==='AI'?-18:-12,lineHeight:0.85
    }}>{word}</div>
  );
};

const SceneThree: React.FC<{frame:number}> = ({frame}) => {
  const opacity=sceneOpacity(frame,118,205,6);
  const lock=spring({frame:Math.max(0,frame-171),fps:30,config:{damping:19,stiffness:165,mass:0.65}});
  return (
    <AbsoluteFill style={{opacity,overflow:'hidden'}}>
      <BigWord frame={frame} from={121} to={149} word="PEOPLE" color={C.white} align="left"/>
      <BigWord frame={frame} from={144} to={172} word="DATA" color={C.cyan} align="right"/>
      <BigWord frame={frame} from={167} to={191} word="AI" color={C.white} align="left"/>
      <div style={{
        position:'absolute',left:66,right:66,top:650,
        display:'flex',justifyContent:'space-between',alignItems:'center',
        opacity:interpolate(frame,[175,190],[0,1],clamp),
        transform:`translateY(${interpolate(lock,[0,1],[28,0],clamp)}px)`,
        fontFamily:'Arial, Helvetica, sans-serif',fontWeight:800,fontSize:58,letterSpacing:1.5
      }}>
        <span style={{color:C.white}}>PEOPLE</span>
        <span style={{color:C.cyan}}>×</span>
        <span style={{color:C.white}}>DATA</span>
        <span style={{color:C.cyan}}>×</span>
        <span style={{color:C.white}}>AI</span>
      </div>
      <div style={{
        position:'absolute',left:66,right:66,top:734,height:4,background:C.cyan,
        transformOrigin:'left',
        transform:`scaleX(${interpolate(frame,[180,199],[0,1],clamp)})`
      }}/>
    </AbsoluteFill>
  );
};

const SceneFour: React.FC<{frame:number}> = ({frame}) => {
  const opacity=sceneOpacity(frame,192,264,6);
  const local=Math.max(0,frame-192);
  const p1=spring({frame:local,fps:30,config:{damping:20,stiffness:170,mass:0.66}});
  const p2=spring({frame:Math.max(0,local-6),fps:30,config:{damping:20,stiffness:165,mass:0.68}});
  const p3=spring({frame:Math.max(0,local-12),fps:30,config:{damping:19,stiffness:160,mass:0.7}});
  const rows=[
    ['EMPLOYEE',p1,305,C.white,148],
    ['EXPERIENCE',p2,445,C.white,130],
    ['DESIGNER',p3,575,C.cyan,154],
  ] as const;
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{
        position:'absolute',left:72,top:190,color:C.cyan,
        fontFamily:'Arial, Helvetica, sans-serif',fontSize:21,fontWeight:750,letterSpacing:7
      }}>THE ROLE</div>
      {rows.map(([word,p,top,color,size])=>(
        <div key={word} style={{
          position:'absolute',left:66,top,
          color,fontFamily:'Arial, Helvetica, sans-serif',
          fontSize:size,fontWeight:900,letterSpacing:-7,lineHeight:0.88,
          transform:`translateX(${interpolate(p,[0,1],[190,0],clamp)}px)`,
          clipPath:`inset(0 0 0 ${interpolate(p,[0,1],[100,0],clamp)}%)`
        }}>{word}</div>
      ))}
    </AbsoluteFill>
  );
};

const LogoOutro: React.FC<{frame:number}> = ({frame}) => {
  const start=248;
  const local=Math.max(0,frame-start);
  const wipe=interpolate(local,[20,54],[0,1],clamp);
  const logo=spring({frame:Math.max(0,local-43),fps:30,config:{damping:18,stiffness:125,mass:0.76}});
  const logoOpacity=interpolate(local,[44,59],[0,1],clamp);
  const roleOpacity=interpolate(local,[60,75],[0,1],clamp);
  return (
    <AbsoluteFill style={{overflow:'hidden'}}>
      <AbsoluteFill style={{background:C.blue1}}/>
      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        {[
          ['M -120 410 C 190 230, 365 270, 590 390 C 790 495, 940 460, 1200 275',0],
          ['M -120 475 C 170 315, 380 325, 605 450 C 805 560, 955 520, 1200 345',6],
          ['M -120 540 C 160 390, 395 385, 620 505 C 825 615, 980 570, 1210 420',12],
        ].map(([d,delay],i)=>{
          const p=interpolate(local,[delay as number,(delay as number)+34],[0,1],clamp);
          return <path key={i} d={d as string} fill="none"
            stroke={i===0?C.cyanSoft:C.cyan}
            strokeWidth={i===0?5:3}
            opacity={0.95-i*0.15}
            pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}
            strokeLinecap="round"/>;
        })}
      </svg>
      <div style={{
        position:'absolute',left:0,right:0,bottom:0,height:`${wipe*100}%`,
        background:C.paper,borderTop:wipe>0.01?`3px solid ${C.cyan}`:'none'
      }}/>
      <div style={{
        position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
        flexDirection:'column',opacity:logoOpacity,
        transform:`translateY(${interpolate(logo,[0,1],[34,0],clamp)}px) scale(${interpolate(logo,[0,1],[0.94,1],clamp)})`
      }}>
        <Img src={staticFile('logo-mci-02.svg')} style={{width:470,height:190,objectFit:'contain'}}/>
        <div style={{marginTop:36,width:74,height:3,background:C.cyan,opacity:roleOpacity}}/>
        <div style={{
          marginTop:22,opacity:roleOpacity,color:C.ink,
          fontFamily:'Arial, Helvetica, sans-serif',
          fontSize:30,fontWeight:700,letterSpacing:1.3
        }}>Employee Experience Designer</div>
      </div>
    </AbsoluteFill>
  );
};

export const MciNewChapter: React.FC = () => {
  const frame=useCurrentFrame();
  return (
    <AbsoluteFill style={{background:C.blue0,overflow:'hidden'}}>
      <Audio src={staticFile('mci-new-chapter-sound.wav')} volume={0.9}/>
      <Background frame={frame}/>
      {frame<58?<SceneOne frame={frame}/>:null}
      {frame>=44&&frame<132?<SceneTwo frame={frame}/>:null}
      {frame>=118&&frame<205?<SceneThree frame={frame}/>:null}
      {frame>=192&&frame<264?<SceneFour frame={frame}/>:null}
      {frame>=248?<LogoOutro frame={frame}/>:null}
    </AbsoluteFill>
  );
};
