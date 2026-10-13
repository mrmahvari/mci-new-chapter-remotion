import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const C = {
  navy: '#07131F',
  cyan: '#12A8E0',
  cyanSoft: '#53C7EF',
  paper: '#F7F6F2',
  ink: '#0A1720',
  white: '#F7FBFD',
  muted: '#8EA5B5',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const sceneOpacity = (frame: number, start: number, end: number, fade = 8) =>
  Math.min(
    interpolate(frame, [start, start + fade], [0, 1], clamp),
    interpolate(frame, [end - fade, end], [1, 0], clamp),
  );

const Grid: React.FC<{frame: number}> = ({frame}) => {
  const shift = interpolate(frame, [0, 390], [0, 38], clamp);
  return (
    <AbsoluteFill style={{background: C.navy, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.018), transparent 36%), radial-gradient(circle at 82% 14%, rgba(18,168,224,0.09), transparent 26%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: -80,
          transform: `translateY(${shift}px)`,
          opacity: 0.12,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 0,
          bottom: 0,
          width: 2,
          background: C.cyan,
          opacity: 0.75,
          transform: `scaleY(${interpolate(frame, [0, 24], [0, 1], clamp)})`,
          transformOrigin: 'top',
        }}
      />
    </AbsoluteFill>
  );
};

const SceneOne: React.FC<{frame: number}> = ({frame}) => {
  const opacity = sceneOpacity(frame, 0, 68, 7);
  const aNew = spring({frame, fps: 30, config: {damping: 18, stiffness: 150, mass: 0.75}});
  const chapter = spring({frame: Math.max(0, frame - 8), fps: 30, config: {damping: 18, stiffness: 145, mass: 0.8}});

  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{
        position:'absolute', left:88, top:190, color:C.cyan,
        fontFamily:'Arial, Helvetica, sans-serif', fontWeight:700, fontSize:44,
        letterSpacing:12, transform:`translateY(${interpolate(aNew,[0,1],[50,0],clamp)}px)`,
        clipPath:`inset(${interpolate(aNew,[0,1],[100,0],clamp)}% 0 0 0)`
      }}>A NEW</div>

      <div style={{
        position:'absolute', left:78, top:322, width:1120, color:C.white,
        fontFamily:'Arial, Helvetica, sans-serif', fontWeight:800, fontSize:162,
        letterSpacing:-8, lineHeight:0.86, whiteSpace:'nowrap',
        transform:`translateX(${interpolate(chapter,[0,1],[-120,0],clamp)}px)`,
        clipPath:`inset(0 ${interpolate(chapter,[0,1],[100,0],clamp)}% 0 0)`
      }}>CHAPTER</div>

      <div style={{
        position:'absolute', left:88, top:545, height:3,
        width:interpolate(frame,[16,44],[0,700],clamp), background:C.cyan
      }}/>

      <div style={{
        position:'absolute', right:72, bottom:96, color:C.muted,
        fontFamily:'Arial, Helvetica, sans-serif', fontSize:20, letterSpacing:4
      }}>01 / 04</div>
    </AbsoluteFill>
  );
};

const SceneTwo: React.FC<{frame: number}> = ({frame}) => {
  const start=52, local=Math.max(0, frame-start);
  const opacity=sceneOpacity(frame,52,148,8);
  const employee=spring({frame:local,fps:30,config:{damping:20,stiffness:150,mass:0.72}});
  const experience=spring({frame:Math.max(0,local-7),fps:30,config:{damping:19,stiffness:145,mass:0.75}});

  return (
    <AbsoluteFill style={{opacity, overflow:'hidden'}}>
      <div style={{
        position:'absolute', left:78, top:255, color:C.white,
        fontFamily:'Arial, Helvetica, sans-serif', fontWeight:800, fontSize:126,
        lineHeight:0.88, letterSpacing:-5,
        transform:`translateX(${interpolate(employee,[0,1],[210,0],clamp)}px)`,
        clipPath:`inset(0 0 0 ${interpolate(employee,[0,1],[100,0],clamp)}%)`
      }}>EMPLOYEE</div>

      <div style={{
        position:'absolute', left:74, top:392, color:C.cyan,
        fontFamily:'Arial, Helvetica, sans-serif', fontWeight:800, fontSize:154,
        lineHeight:0.84, letterSpacing:-7, whiteSpace:'nowrap',
        transform:`translateX(${interpolate(experience,[0,1],[-250,0],clamp)}px)`,
        clipPath:`inset(0 ${interpolate(experience,[0,1],[100,0],clamp)}% 0 0)`
      }}>EXPERIENCE</div>

      <div style={{
        position:'absolute', left:78, top:600, width:620, color:C.muted,
        fontFamily:'Arial, Helvetica, sans-serif', fontSize:24, letterSpacing:5
      }}>DESIGNING BETTER WORK EXPERIENCES</div>

      <div style={{
        position:'absolute', right:-130, top:170, width:520, height:520,
        border:`2px solid ${C.cyan}`, borderRadius:'50%', opacity:0.28,
        transform:`scale(${interpolate(local,[0,55],[0.76,1.05],clamp)})`
      }}/>

      <div style={{
        position:'absolute', right:72, bottom:96, color:C.muted,
        fontFamily:'Arial, Helvetica, sans-serif', fontSize:20, letterSpacing:4
      }}>02 / 04</div>
    </AbsoluteFill>
  );
};

const FlashWord: React.FC<{frame:number; from:number; to:number; word:string; align?:'left'|'right'}> = ({frame,from,to,word,align='left'}) => {
  const opacity=sceneOpacity(frame,from,to,4);
  const p=interpolate(frame,[from,from+10],[0,1],clamp);
  const x=align==='left'?interpolate(p,[0,1],[-180,0],clamp):interpolate(p,[0,1],[180,0],clamp);
  return (
    <div style={{
      position:'absolute', left:align==='left'?72:undefined, right:align==='right'?72:undefined,
      top:270, opacity, transform:`translateX(${x}px)`,
      fontFamily:'Arial, Helvetica, sans-serif', fontSize:word==='AI'?330:212,
      lineHeight:0.86, fontWeight:850, letterSpacing:word==='AI'?-16:-10,
      color:word==='DATA'?C.cyan:C.white
    }}>{word}</div>
  );
};

const SceneThree: React.FC<{frame:number}> = ({frame}) => {
  const opacity=sceneOpacity(frame,132,232,7);
  const lock=spring({frame:Math.max(0,frame-188),fps:30,config:{damping:18,stiffness:150,mass:0.7}});

  return (
    <AbsoluteFill style={{opacity,overflow:'hidden'}}>
      <FlashWord frame={frame} from={136} to={168} word="PEOPLE" align="left"/>
      <FlashWord frame={frame} from={160} to={192} word="DATA" align="right"/>
      <FlashWord frame={frame} from={184} to={210} word="AI" align="left"/>

      <div style={{position:'absolute',left:70,right:70,top:565,height:1,background:'rgba(255,255,255,0.22)'}}/>

      <div style={{
        position:'absolute', left:70, right:70, top:615, display:'flex',
        justifyContent:'space-between', alignItems:'center',
        opacity:interpolate(frame,[192,208],[0,1],clamp),
        transform:`translateY(${interpolate(lock,[0,1],[30,0],clamp)}px)`,
        fontFamily:'Arial, Helvetica, sans-serif', fontSize:56, fontWeight:750, letterSpacing:2
      }}>
        <span style={{color:C.white}}>PEOPLE</span><span style={{color:C.cyan}}>×</span>
        <span style={{color:C.white}}>DATA</span><span style={{color:C.cyan}}>×</span>
        <span style={{color:C.white}}>AI</span>
      </div>

      <div style={{
        position:'absolute',left:70,right:70,top:700,height:3,background:C.cyan,
        transformOrigin:'left', transform:`scaleX(${interpolate(frame,[196,224],[0,1],clamp)})`
      }}/>

      <div style={{
        position:'absolute',right:72,bottom:96,color:C.muted,
        fontFamily:'Arial, Helvetica, sans-serif',fontSize:20,letterSpacing:4
      }}>03 / 04</div>
    </AbsoluteFill>
  );
};

const SceneFour: React.FC<{frame:number}> = ({frame}) => {
  const opacity=sceneOpacity(frame,216,298,8);
  const local=Math.max(0,frame-216);
  const mk=(d:number)=>spring({frame:Math.max(0,local-d),fps:30,config:{damping:20,stiffness:155,mass:0.72}});
  const p1=mk(0), p2=mk(6), p3=mk(12);

  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{
        position:'absolute',left:78,top:210,color:C.cyan,
        fontFamily:'Arial, Helvetica, sans-serif',fontSize:24,fontWeight:700,letterSpacing:7
      }}>THE ROLE</div>

      {[
        ['EMPLOYEE',p1,340,C.white],
        ['EXPERIENCE',p2,470,C.white],
        ['DESIGNER',p3,600,C.cyan],
      ].map(([word,p,top,color])=>(
        <div key={word as string} style={{
          position:'absolute',left:72,top:top as number,
          fontFamily:'Arial, Helvetica, sans-serif',
          fontSize:word==='EXPERIENCE'?122:145,lineHeight:0.9,fontWeight:850,letterSpacing:-6,
          color:color as string,
          transform:`translateX(${interpolate(p as number,[0,1],[180,0],clamp)}px)`,
          clipPath:`inset(0 0 0 ${interpolate(p as number,[0,1],[100,0],clamp)}%)`
        }}>{word as string}</div>
      ))}

      <div style={{
        position:'absolute',left:78,bottom:150,
        width:interpolate(frame,[240,280],[0,620],clamp),height:3,background:C.cyan
      }}/>

      <div style={{
        position:'absolute',right:72,bottom:96,color:C.muted,
        fontFamily:'Arial, Helvetica, sans-serif',fontSize:20,letterSpacing:4
      }}>04 / 04</div>
    </AbsoluteFill>
  );
};

const LogoOutro: React.FC<{frame:number}> = ({frame}) => {
  const start=278, local=Math.max(0,frame-start);
  const paper=interpolate(local,[28,60],[0,1],clamp);
  const logoSpring=spring({frame:Math.max(0,local-50),fps:30,config:{damping:18,stiffness:120,mass:0.8}});
  const logoOpacity=interpolate(local,[52,68],[0,1],clamp);
  const roleOpacity=interpolate(local,[67,82],[0,1],clamp);

  return (
    <AbsoluteFill style={{overflow:'hidden'}}>
      <AbsoluteFill style={{background:C.navy}}/>

      <svg viewBox="0 0 1080 1350" width="1080" height="1350" style={{position:'absolute',inset:0}}>
        {[
          ['M -120 410 C 180 250, 360 260, 595 390 C 780 492, 930 470, 1190 290',0],
          ['M -120 470 C 170 320, 375 315, 600 445 C 795 558, 945 525, 1200 350',7],
          ['M -120 530 C 160 390, 390 370, 610 495 C 810 610, 965 575, 1210 410',14],
          ['M -120 590 C 155 455, 410 420, 620 545 C 825 668, 985 625, 1220 470',21],
        ].map(([d,delay],i)=>{
          const p=interpolate(local,[delay as number,(delay as number)+38],[0,1],clamp);
          return <path key={i} d={d as string} fill="none"
            stroke={i===0?C.cyanSoft:C.cyan} strokeWidth={i===0?5:3}
            opacity={0.95-i*0.13} pathLength={1}
            strokeDasharray={1} strokeDashoffset={1-p} strokeLinecap="round"/>;
        })}
      </svg>

      <div style={{
        position:'absolute',left:0,right:0,bottom:0,height:`${paper*100}%`,
        background:C.paper,borderTop:paper>0.01?`4px solid ${C.cyan}`:'none'
      }}/>

      <div style={{
        position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',
        flexDirection:'column',opacity:logoOpacity,
        transform:`translateY(${interpolate(logoSpring,[0,1],[40,0],clamp)}px) scale(${interpolate(logoSpring,[0,1],[0.92,1],clamp)})`
      }}>
        <Img src={staticFile('logo-mci-02.svg')} style={{width:430,height:180,objectFit:'contain'}}/>
        <div style={{marginTop:44,width:90,height:3,background:C.cyan,opacity:roleOpacity}}/>
        <div style={{
          marginTop:24,opacity:roleOpacity,color:C.ink,
          fontFamily:'Arial, Helvetica, sans-serif',fontSize:30,fontWeight:650,letterSpacing:1.6
        }}>Employee Experience Designer</div>
      </div>
    </AbsoluteFill>
  );
};

export const MciNewChapter: React.FC = () => {
  const frame=useCurrentFrame();
  return (
    <AbsoluteFill style={{background:C.navy,overflow:'hidden'}}>
      <Grid frame={frame}/>
      {frame<68?<SceneOne frame={frame}/>:null}
      {frame>=52&&frame<148?<SceneTwo frame={frame}/>:null}
      {frame>=132&&frame<232?<SceneThree frame={frame}/>:null}
      {frame>=216&&frame<298?<SceneFour frame={frame}/>:null}
      {frame>=278?<LogoOutro frame={frame}/>:null}
    </AbsoluteFill>
  );
};
