import React from 'react';
import {Composition} from 'remotion';
import {MciNewChapter} from './MciNewChapter';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MciNewChapter"
      component={MciNewChapter}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1350}
    />
  );
};
