import React, {useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {renderMediaOnWeb} from '@remotion/web-renderer';
import {FFmpeg} from '@ffmpeg/ffmpeg';
import {fetchFile, toBlobURL} from '@ffmpeg/util';
import {MciNewChapter} from './MciNewChapter';

const composition = {
  id: 'MciNewChapter',
  component: MciNewChapter,
  durationInFrames: 405,
  fps: 30,
  width: 1080,
  height: 1350,
  calculateMetadata: null,
};

type Status = 'idle' | 'rendering' | 'muxing' | 'ready' | 'error';

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(
    'This renders the exact browser visuals first, then adds the approved audio without re-encoding the video.'
  );
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const buttonLabel = useMemo(() => {
    if (status === 'rendering') return 'Rendering exact visuals…';
    if (status === 'muxing') return 'Adding approved audio…';
    if (status === 'ready') return 'Ready';
    return 'Create Final MP4';
  }, [status]);

  const ensureFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();

    const baseURL =
      'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

    setMessage('Loading the browser muxer once (~31 MB)…');

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.js`,
        'text/javascript'
      ),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const createFinal = async () => {
    setStatus('rendering');
    setProgress(0);
    setDownloadUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });

    try {
      setMessage('Rendering the exact Chrome visuals — audio extraction is disabled.');

      // Critical fix:
      // muted:true makes Remotion skip audio extraction entirely.
      // Therefore StackBlitz/WebContainer cannot get stuck on "Extracting audio for frame 0".
      const render = await renderMediaOnWeb({
        composition,
        inputProps: {},
        container: 'mp4',
        videoCodec: 'h264',
        muted: true,
        videoBitrate: 'very-high',
        hardwareAcceleration: 'no-preference',
        pageResponsiveness: 'high',
        outputTarget: 'arraybuffer',
        delayRenderTimeoutInMilliseconds: 120000,
        onProgress: ({progress: p, renderEstimatedTime}) => {
          setProgress(p * 0.82);
          const eta =
            renderEstimatedTime && renderEstimatedTime > 0
              ? ` · about ${Math.ceil(renderEstimatedTime / 1000)}s left`
              : '';
          setMessage(`Rendering exact visuals ${Math.round(p * 100)}%${eta}`);
        },
      });

      const silentVideoBlob = await render.getBlob();

      setStatus('muxing');
      setProgress(0.84);

      const ffmpeg = await ensureFFmpeg();

      setMessage('Adding the approved V22 audio — video stream stays untouched.');

      await ffmpeg.writeFile('video.mp4', await fetchFile(silentVideoBlob));
      await ffmpeg.writeFile(
        'audio.mp3',
        await fetchFile('/mci-new-chapter-sound.mp3')
      );

      // "-c:v copy" is the key guarantee: the exact browser-rendered H.264
      // video stream is copied bit-for-bit; only audio is encoded to AAC.
      await ffmpeg.exec([
        '-i', 'video.mp4',
        '-i', 'audio.mp3',
        '-map', '0:v:0',
        '-map', '1:a:0',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '256k',
        '-shortest',
        '-movflags', '+faststart',
        'final.mp4',
      ]);

      setProgress(0.98);

      const data = await ffmpeg.readFile('final.mp4');

      if (typeof data === 'string') {
        throw new Error('Unexpected FFmpeg output format.');
      }

      const finalBlob = new Blob([data.buffer], {type: 'video/mp4'});
      const url = URL.createObjectURL(finalBlob);

      setDownloadUrl(url);
      setProgress(1);
      setStatus('ready');
      setMessage(
        'Done. The video is the exact Chrome render; only the approved audio was muxed onto it.'
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: 32,
        display: 'grid',
        placeItems: 'center',
        background:
          'linear-gradient(135deg, #102B40 0%, #173A55 58%, #1F4D6C 100%)',
        color: '#F7FBFD',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <section
        style={{
          width: 'min(720px, 100%)',
          padding: 36,
          border: '1px solid rgba(120,199,227,.28)',
          borderRadius: 18,
          background: 'rgba(9,31,47,.58)',
          boxShadow: '0 24px 80px rgba(0,0,0,.22)',
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 3.2,
            color: '#78C7E3',
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          FINAL V22 · EXACT BROWSER VISUALS
        </div>

        <h1 style={{fontSize: 34, margin: '0 0 12px', lineHeight: 1.1}}>
          Render visuals first. Add audio second.
        </h1>

        <p style={{margin: '0 0 28px', lineHeight: 1.65, color: '#D6E1E7'}}>
          This bypasses the WebContainer audio-extraction bug. Remotion renders
          the visuals in this Chrome tab with audio muted, then FFmpeg.wasm
          attaches the approved V22 audio using video stream-copy.
        </p>

        <button
          onClick={createFinal}
          disabled={status === 'rendering' || status === 'muxing'}
          style={{
            width: '100%',
            padding: '16px 20px',
            border: 0,
            borderRadius: 12,
            cursor:
              status === 'rendering' || status === 'muxing'
                ? 'default'
                : 'pointer',
            background:
              status === 'rendering' || status === 'muxing'
                ? '#4A7187'
                : '#2AA9D6',
            color: 'white',
            fontWeight: 800,
            fontSize: 17,
          }}
        >
          {buttonLabel}
        </button>

        <div
          style={{
            height: 8,
            marginTop: 20,
            overflow: 'hidden',
            borderRadius: 999,
            background: 'rgba(255,255,255,.11)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
              background: '#78C7E3',
              transition: 'width .15s linear',
            }}
          />
        </div>

        <div
          style={{
            minHeight: 44,
            marginTop: 12,
            color: status === 'error' ? '#FFB7B7' : '#BFD0D9',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>

        {downloadUrl ? (
          <a
            href={downloadUrl}
            download="MCI_New_Chapter_V22_FINAL.mp4"
            style={{
              display: 'block',
              marginTop: 18,
              padding: '16px 20px',
              borderRadius: 12,
              textAlign: 'center',
              textDecoration: 'none',
              background: '#F7FBFD',
              color: '#102B40',
              fontWeight: 900,
              fontSize: 17,
            }}
          >
            Download Final MP4
          </a>
        ) : null}
      </section>
    </main>
  );
};

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(<App />);
