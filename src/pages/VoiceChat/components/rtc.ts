import Peer from 'simple-peer';

export type Table = {
  [key: string]: PeerWrapper;
};

export type PeerWrapper = {
  peer: Peer.Instance;
  audio: HTMLAudioElement;
};

export function createCallerPeers(
  socketIds: string[],
  stream: MediaStream,
  transfer: (type: string, to: string, data: any) => void,
): Table {
  const peers: Table = {};

  socketIds.forEach((socketId) => {
    const peer = new Peer({
      initiator: true,
      stream: stream,
    });
    const remoteAudio = document.createElement('audio');
    const peerWrapper = {
      peer: peer,
      audio: remoteAudio,
    };

    peer.on('signal', (data) => {
      // console.log("call signal", socketId, data)
      transfer('call_signal', socketId, data);
    });

    peer.on('stream', (stream) => {
      // console.log("call get stream", socketId, stream)
      remoteAudio.autoplay = true;
      remoteAudio.srcObject = stream;
    });

    peer.on('error', (error) => {
      console.log('error', error);
      peer.destroy();
      remoteAudio.remove();
    });

    peers[socketId] = peerWrapper;
  });
  return peers;
}

export function createAnswerPeer(
  socketId: string,
  stream: MediaStream,
  transfer: (type: string, to: string, data: any) => void,
): PeerWrapper {
  const peer = new Peer({
    stream: stream,
  });
  const remoteAudio = document.createElement('audio');
  const peerWrapper = {
    peer: peer,
    audio: remoteAudio,
  };

  peer.on('signal', (data) => {
    // console.log("answer signal", socketId, data)
    transfer('answer_signal', socketId, data);
  });

  peer.on('stream', (stream) => {
    // console.log("answer get stream", socketId, stream)
    remoteAudio.autoplay = true;
    remoteAudio.srcObject = stream;
  });

  peer.on('error', (error) => {
    console.log('error', socketId, error);
    peer.destroy();
    remoteAudio.remove();
  });

  return peerWrapper;
}
