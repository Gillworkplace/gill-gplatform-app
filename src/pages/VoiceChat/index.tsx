import AudioRoom from '@/pages/VoiceChat/components/audio-room';
import EnterForm from '@/pages/VoiceChat/components/enter-form';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';

const VoiceChat: React.FC = () => {
  const { styles } = createStyles(({}) => {
    return {
      container: {
        margin: '20px 10px 10px 10px',
        width: '100%',
        height: '100%',
        display: 'block',
      },
    };
  })();

  // 0 未加入房间； 1 已加入房间
  const [state, setState] = useState(0);

  const [roomId, setRoomId] = useState<number>(-1);
  const [roomPassword, setRoomPassword] = useState<string | undefined>('');

  const handleEnterRoom = (roomId: number, roomPassword?: string) => {
    setRoomId(roomId);
    setRoomPassword(roomPassword);
    setState(1);
  };

  return (
    <div className={styles.container}>
      {state === 0 && (
        <>
          <EnterForm onEnter={handleEnterRoom} />
        </>
      )}
      {state === 1 && (
        <>
          <AudioRoom roomId={roomId} roomPassword={roomPassword} onExit={() => setState(0)} />
        </>
      )}
    </div>
  );
};
export default VoiceChat;
