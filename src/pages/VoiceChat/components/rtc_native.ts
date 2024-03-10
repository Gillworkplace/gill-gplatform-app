import { WebRtcSetting } from '@/pages/VoiceChat/setting';

export type Table = {
  [key: string]: PeerWrapper;
};

export type PeerWrapper = {
  socketId: string;
  peer: RTCPeerConnection;
  audio: HTMLAudioElement;
};

export function createCallerPeers(
  socketIds: string[],
  stream: MediaStream,
  transfer: (type: string, to: string, data: any) => void,
): Table {
  const peers: Table = {};

  socketIds.forEach(async (socketId) => {
    const peer = new RTCPeerConnection(WebRtcSetting);
    console.log('caller new peer');
    const remoteAudio = document.createElement('audio');
    const peerWrapper: PeerWrapper = {
      socketId: socketId,
      peer: peer,
      audio: remoteAudio,
    };

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    console.log('caller add local tracks');

    peer.onconnectionstatechange = () => {
      console.log('answer connection change', peer.connectionState);
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('caller on candidate', e.candidate);
        transfer('candidate', socketId, e.candidate);
      }
    };

    peer.ontrack = (e) => {
      console.log('caller on track', e);
      remoteAudio.srcObject = e.streams[0];
      remoteAudio.autoplay = true;
    };

    peers[socketId] = peerWrapper;
  });
  return peers;
}

export async function createAnswerPeer(
  socketId: string,
  stream: MediaStream,
  offer: RTCSessionDescriptionInit,
  transfer: (type: string, to: string, data: any) => void,
): Promise<PeerWrapper> {
  const peer = new RTCPeerConnection(WebRtcSetting);
  console.log('caller new peer');
  const remoteAudio = document.createElement('audio');
  const peerWrapper: PeerWrapper = {
    socketId: socketId,
    peer: peer,
    audio: remoteAudio,
  };

  stream.getTracks().forEach((track) => peer.addTrack(track, stream));
  console.log('answer add local tracks');

  peer.onconnectionstatechange = () => {
    console.log('answer connection change', peer.connectionState);
  };

  peer.onicecandidate = (e) => {
    console.log('answer on candidate', e);
    if (e.candidate) {
      transfer('candidate', socketId, e.candidate);
    }
  };

  peer.ontrack = (e) => {
    console.log('answer on track', e);
    remoteAudio.srcObject = e.streams[0];
    remoteAudio.autoplay = true;
  };

  await peer.setRemoteDescription(offer);

  return peerWrapper;
}
