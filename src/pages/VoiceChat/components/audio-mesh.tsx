import {
  PeerWrapper,
  Table,
  createAnswerPeer,
  createCallerPeers,
} from '@/pages/VoiceChat/components/rtc_native';
import Cookies from 'js-cookie';
import React, { useEffect, useRef } from 'react';

type RtcPermission = {
  rtcToken: string;
  socketIds: string[];
};

type RtcMessage = {
  type: string;
  data: string;
  from?: string;
};

type Props = {
  roomId: number;
  roomPassword?: string;
  inputDevice?: string;
};

const AudioMesh: React.FC<Props> = (props) => {
  const _peers = useRef<Table>({});

  const _ws = useRef<WebSocket>();
  const _rtcToken = useRef<string>();
  const _stream = useRef<MediaStream>();

  const dispatcher = new Map<string, (message: RtcMessage) => void>();

  /**
   * 转发消息
   * @param type 类型
   * @param to 接收方
   * @param data 数据
   */
  function transfer(type: string, to: string, data: any) {
    _ws.current!.send(
      JSON.stringify({
        rtcToken: _rtcToken.current,
        type: type,
        to: to,
        data: JSON.stringify(data),
      }),
    );
  }

  async function joinRoom(message: RtcMessage) {
    const permission: RtcPermission = JSON.parse(message.data);
    console.log('accept connection', permission.socketIds.length);
    _rtcToken.current = permission.rtcToken;
    const newPeers = createCallerPeers(permission.socketIds, _stream.current!, transfer);
    _peers.current = {
      ..._peers.current,
      ...newPeers,
    };
    for (let key in newPeers) {
      if (newPeers.hasOwnProperty(key)) {
        const peerWrapper = newPeers[key];
        const offer = await peerWrapper.peer.createOffer();
        await peerWrapper.peer.setLocalDescription(offer);
        transfer('offer', peerWrapper.socketId, offer);
      }
    }
  }

  async function handleOffer(message: RtcMessage) {
    console.log('answer receive answer', message);
    const peers = _peers.current;
    const offer: RTCSessionDescriptionInit = JSON.parse(message.data);
    const peerWrapper = await createAnswerPeer(message.from!, _stream.current!, offer, transfer);
    peers[message.from!] = peerWrapper;
    const answer = await peerWrapper.peer.createAnswer();
    await peerWrapper.peer.setLocalDescription(answer);
    transfer('answer', peerWrapper.socketId, answer);
  }

  async function handleAnswer(message: RtcMessage) {
    console.log('caller receive answer', message);
    const peers = _peers.current;
    const peerWrapper = peers[message.from!];
    const peer = peerWrapper.peer;
    const answer: RTCSessionDescriptionInit = JSON.parse(message.data);
    await peer.setRemoteDescription(answer);
  }

  async function handleCandidate(message: RtcMessage) {
    const peers = _peers.current;
    const peerWrapper = peers[message.from!];
    const peer = peerWrapper.peer;
    const candidate: RTCIceCandidateInit = JSON.parse(message.data);
    peer
      .addIceCandidate(candidate)
      .then(() => console.log(`${peerWrapper.socketId} AddIceCandidate success.`))
      .catch((e) => console.log(`Failed to add ICE candidate: ${e.toString()}`));
  }

  // 以上websocket事件处理

  function initWs() {
    const uid = Cookies.get('uid');
    const tid = Cookies.get('tid');
    const room = props.roomId;
    const ws = new WebSocket(
      `wss://localhost:8000/websocket/media/webrtc/mesh?uid=${uid}&tid=${tid}&room=${room}`,
    );
    _ws.current = ws;
    ws.onopen = () => {
      console.log('websocket 建立');
    };
    ws.onclose = () => {
      console.log('websocket 关闭');
    };
    ws.onerror = (event: Event) => {
      console.log('websocket 异常：', event);
    };
    ws.onmessage = (event: MessageEvent<RtcMessage>) => {
      // console.log('websocket onmessage', event)
      const message = JSON.parse(event.data.toString());
      const handler = dispatcher.get(message.type);
      handler?.(message);
    };
  }

  function clearPeer(peerWrapper?: PeerWrapper) {
    peerWrapper?.peer.close();
    peerWrapper?.audio.remove();
  }

  function clearPeers() {
    const peers = _peers.current;
    for (let key in peers) {
      if (peers.hasOwnProperty(key)) {
        clearPeer(peers[key]);
      }
    }
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        _stream.current = stream;

        // 初始化websocket
        initWs();
      })
      .catch((err) => {
        console.log('getUserMedia error', err);
      });
    return () => {
      clearPeers();
      _ws.current?.close();
      _stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  dispatcher.set('accept_connection', joinRoom);
  dispatcher.set('offer', handleOffer);
  dispatcher.set('answer', handleAnswer);
  dispatcher.set('candidate', handleCandidate);

  return <></>;
};

export default AudioMesh;
