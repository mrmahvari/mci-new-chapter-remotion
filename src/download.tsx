import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {renderMediaOnWeb} from '@remotion/web-renderer';
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

const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'rendering' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const renderAndSave = async () => {
    setStatus('rendering');
    setProgress(0);
    setMessage('Preparing render…');

    try {
      const savePicker = (window as typeof window & {
        showSaveFilePicker?: (options: {
          suggestedName: string;
          types: Array<{
            description: string;
            accept: Record<string, string[]>;
          }>;
        }) => Promise<{
          createWritable: () => Promise<WritableStream>;
        }>;
      }).showSaveFilePicker;

      if (savePicker) {
        // Ask for the destination first, then stream the render directly to the user's disk.
        // Nothing is written to StackBlitz project storage.
        const fileHandle = await savePicker({
          suggestedName: 'MCI_New_Chapter_V22_FINAL.mp4',
          types: [
            {
              description: 'MP4 video',
              accept: {'video/mp4': ['.mp4']},
            },
          ],
        });

        const outputWritable = await fileHandle.createWritable();

        await renderMediaOnWeb({
          composition,
          inputProps: {},
          container: 'mp4',
          videoCodec: 'h264',
          audioCodec: 'aac',
          videoBitrate: 'very-high',
          audioBitrate: 'high',
          hardwareAcceleration: 'no-preference',
          pageResponsiveness: 'high',
          delayRenderTimeoutInMilliseconds: 120000,
          outputWritable,
          onProgress: ({progress: p, renderEstimatedTime}) => {
            setProgress(p);
            const eta =
              renderEstimatedTime && renderEstimatedTime > 0
                ? ` · about ${Math.ceil(renderEstimatedTime / 1000)}s left`
                : '';
            setMessage(`Rendering ${Math.round(p * 100)}%${eta}`);
          },
        });
      } else {
        // Fallback for browsers that do not expose File System Access API.
        const result = await renderMediaOnWeb({
          composition,
          inputProps: {},
          container: 'mp4',
          videoCodec: 'h264',
          audioCodec: 'aac',
          videoBitrate: 'very-high',
          audioBitrate: 'high',
          hardwareAcceleration: 'no-preference',
          pageResponsiveness: 'high',
          delayRenderTimeoutInMilliseconds: 120000,
          outputTarget: 'arraybuffer',
          onProgress: ({progress: p, renderEstimatedTime}) => {
            setProgress(p);
            const eta =
              renderEstimatedTime && renderEstimatedTime > 0
                ? ` · about ${Math.ceil(renderEstimatedTime / 1000)}s left`
                : '';
            setMessage(`Rendering ${Math.round(p * 100)}%${eta}`);
          },
        });

        const blob = await result.getBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'MCI_New_Chapter_V22_FINAL.mp4';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }

      setProgress(1);
      setStatus('done');
      setMessage('Done — the final MP4 is saved on your computer.');
    } catch (err) {
      // Canceling the save dialog is not a rendering failure.
      const text = err instanceof Error ? err.message : String(err);
      if (text.toLowerCase().includes('abort')) {
        setStatus('idle');
        setMessage('Save cancelled.');
        return;
      }
      setStatus('error');
      setMessage(text);
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
      }}
    >
      <section
        style={{
          width: 'min(680px, 100%)',
          padding: 34,
          border: '1px solid rgba(120,199,227,.28)',
          borderRadius: 18,
          background: 'rgba(9,31,47,.55)',
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
          FINAL V22 · 1080 × 1350 · 30 FPS
        </div>

        <h1 style={{fontSize: 34, margin: '0 0 12px', lineHeight: 1.1}}>
          Download the exact browser render
        </h1>

        <p style={{margin: '0 0 28px', lineHeight: 1.6, color: '#D6E1E7'}}>
          This uses the same MciNewChapter component, same assets, same timing and
          the same Chrome rendering environment. The video is written directly
          to your computer — not to StackBlitz storage.
        </p>

        <button
          onClick={renderAndSave}
          disabled={status === 'rendering'}
          style={{
            width: '100%',
            padding: '16px 20px',
            border: 0,
            borderRadius: 12,
            cursor: status === 'rendering' ? 'default' : 'pointer',
            background: status === 'rendering' ? '#4A7187' : '#2AA9D6',
            color: 'white',
            fontWeight: 800,
            fontSize: 17,
          }}
        >
          {status === 'rendering' ? 'Rendering…' : 'Render & Save Final MP4'}
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
            minHeight: 24,
            marginTop: 12,
            color: status === 'error' ? '#FFB7B7' : '#BFD0D9',
            fontSize: 14,
          }}
        >
          {message || 'Click once, choose where to save the MP4, and wait for 100%.'}
        </div>
      </section>
    </main>
  );
};

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(<App />);
