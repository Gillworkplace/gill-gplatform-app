import {
  PeerWrapper,
  Table,
  createAnswerPeer,
  createCallerPeers,
} from '@/pages/VoiceChat/components/rtc';
import Cookies from 'js-cookie';
import { useEffect, useRef } from 'react';

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

  function joinRoom(message: RtcMessage) {
    console.log('accept connection');
    const permission: RtcPermission = JSON.parse(message.data);
    _rtcToken.current = permission.rtcToken;
    const newPeers = createCallerPeers(permission.socketIds, _stream.current!, transfer);
    _peers.current = {
      ..._peers.current,
      ...newPeers,
    };
  }

  async function handleCallSignal(message: RtcMessage) {
    const peerWrapper = createAnswerPeer(message.from!, _stream.current!, transfer);
    const signalData = JSON.parse(message.data);
    peerWrapper.peer.signal(signalData);
  }

  async function handleAnswerSignal(message: RtcMessage) {
    const peers = _peers.current;
    const signalData = JSON.parse(message.data);
    peers[message.from!].peer.signal(signalData);
  }

  // 以上websocket事件处理

  function initWs() {
    const uid = Cookies.get('uid');
    const tid = Cookies.get('tid');
    const room = props.roomId;
    const ws = new WebSocket(
      `wss://192.168.16.173:8000/websocket/voice/webrtc/mesh?uid=${uid}&tid=${tid}&room=${room}`,
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
    peerWrapper?.peer.destroy();
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
  dispatcher.set('call_signal', handleCallSignal);
  dispatcher.set('answer_signal', handleAnswerSignal);

  return <></>;
};

export default AudioMesh;
