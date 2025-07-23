import { useRef, useState } from 'react';
import data from '../../data/api.json';

interface ScriptConfig {
  type: string;
  audio_url?: string;
  input?: string;
  provider?: { type: string; voice_id: string };
  ssml?: boolean;
}

interface ApiConfig {
  key: string;
  url: string;
  service: 'talks' | 'clips';
}

interface PresenterInput {
  [key: string]: Record<string, string>;
}

export function useStreamingClient() {
  const idleVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamVideoRef = useRef<HTMLVideoElement | null>(null);

  const [status, setStatus] = useState({
    iceGathering: '',
    ice: '',
    peer: '',
    signaling: '',
    streamEvent: '',
    streaming: '',
  });

  const [DID_API, setDID_API] = useState<ApiConfig | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
   
  const [, setPcDataChannel] = useState<RTCDataChannel | null>(null);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
   
  const [, setSessionClientAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);

  let statsIntervalId: ReturnType<typeof setInterval> | null = null;
  let lastBytesReceived = 0;
  let videoIsPlaying = false;

  const stream_warmup = true;

  async function loadApiKey(): Promise<ApiConfig> {
    const apidata: any = data;
    setDID_API(apidata);
    return apidata;
  }

  async function connect() {
    console.log('[connect] 🚀 Starting D-ID stream setup...');
    const api = DID_API || (await loadApiKey());

    stopAllStreams();
    closePC();

    const sessionResponse = await fetch(`${api.url}/${api.service}/streams`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${api.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...presenterInputByService[api.service],
        stream_warmup,
      }),
    });

    const { id, offer, ice_servers, session_id } = await sessionResponse.json();
    setStreamId(id);
    setSessionId(session_id);

    const answer = await createPeerConnection(offer, ice_servers);
    setSessionClientAnswer(answer);

    await fetch(`${api.url}/${api.service}/streams/${id}/sdp`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${api.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer, session_id }),
    });

    console.log('[connect] ✅ Stream created and SDP posted');
  }

  async function createPeerConnection(
    offer: RTCSessionDescriptionInit,
    iceServers: RTCIceServer[]
  ): Promise<RTCSessionDescriptionInit> {
    const pc = new RTCPeerConnection({ iceServers });
    const dataChannel = pc.createDataChannel('JanusDataChannel');

    setPeerConnection(pc);
    setPcDataChannel(dataChannel);

    pc.onicegatheringstatechange = () =>
      setStatus((s) => ({ ...s, iceGathering: pc.iceGatheringState }));

    pc.oniceconnectionstatechange = () => {
      setStatus((s) => ({ ...s, ice: pc.iceConnectionState }));
      if (['failed', 'closed'].includes(pc.iceConnectionState)) {
        stopAllStreams();
        closePC();
      }
    };

    pc.onconnectionstatechange = () =>
      setStatus((s) => ({ ...s, peer: pc.connectionState }));

    pc.onsignalingstatechange = () =>
      setStatus((s) => ({ ...s, signaling: pc.signalingState }));

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (streamVideoRef.current) {
        streamVideoRef.current.srcObject = stream;
        streamVideoRef.current.style.opacity = '1';
      }

      if (idleVideoRef.current) {
        idleVideoRef.current.style.opacity = '0';
      }

      statsIntervalId = setInterval(async () => {
        const stats = await pc.getStats(event.track);
        stats.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            const nowPlaying = report.bytesReceived > lastBytesReceived;
            if (nowPlaying !== videoIsPlaying) {
              videoIsPlaying = nowPlaying;
              setStatus((s) => ({
                ...s,
                streaming: videoIsPlaying ? 'streaming' : 'empty',
              }));
            }
            lastBytesReceived = report.bytesReceived;
          }
        });
      }, 500);
    };

    dataChannel.onmessage = (msg) => {
      const [event] = msg.data.split(':');
      const streamEvent = event.includes('stream/') ? event.replace('stream/', '') : event;
      if (streamEvent === 'ready') {
        setIsStreamReady(true);
        setTimeout(() => setStatus((s) => ({ ...s, streamEvent: 'ready' })), 1000);
      } else {
        setStatus((s) => ({ ...s, streamEvent }));
      }
    };

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  async function startStreamWithScript(script: ScriptConfig) {
    const api = DID_API;
    if (
      api &&
      (peerConnection?.signalingState === 'stable' ||
        peerConnection?.iceConnectionState === 'connected') &&
      isStreamReady
    ) {
      await fetch(`${api.url}/${api.service}/streams/${streamId}`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${api.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script,
          config: { stitch: true },
          session_id: sessionId,
          ...(api.service === 'clips' && {
            background: { color: '#FFFFFF' },
          }),
        }),
      });
    }
  }

  function stopAllStreams() {
    if (streamVideoRef.current?.srcObject) {
      (streamVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      streamVideoRef.current.srcObject = null;
    }
  }

  function closePC() {
    if (peerConnection) {
      peerConnection.close();
      if (statsIntervalId) clearInterval(statsIntervalId);
      setPeerConnection(null);
    }
  }

  // function playIdleVideo() {
  //   if (idleVideoRef.current) {
  //     idleVideoRef.current.src =
  //       DID_API?.service === 'clips'
  //         ? 'alex_v2_idle.mp4'
  //         : 'emma_idle.mp4';
  //   }
  // }

  const presenterInputByService: PresenterInput = {
    talks: {
      source_url:
        'https://create-images-results.d-id.com/DefaultPresenters/Emma_f/v1_image.jpeg',
    },
    clips: {
      presenter_id: 'v2_public_alex@qcvo4gupoy',
      driver_id: 'e3nbserss8',
    },
  };

  return {
    idleVideoRef,
    streamVideoRef,
    connect,
    destroy: async () => {
      await fetch(`${DID_API?.url}/${DID_API?.service}/streams/${streamId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${DID_API?.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      stopAllStreams();
      closePC();
    },
    startTextStream: (script: ScriptConfig) => startStreamWithScript(script),
    startAudioStream: () => startStreamWithScript({
      type: 'audio',
      audio_url:
        'https://d-id-public-bucket.s3.us-west-2.amazonaws.com/webrtc.mp3',
    }),
    isStreamReady,
    streamEvent: status.streamEvent,
    status,
  };
}