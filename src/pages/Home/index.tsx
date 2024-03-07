import { getInt32FromBlob } from '@/components/Util/common-util';
import InfoCard from '@/pages/Home/components/InfoCard';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, theme } from 'antd';
import { createStyles } from 'antd-style';
import Cookies from 'js-cookie';
import React from 'react';

const Index: React.FC = () => {
  const { token } = theme.useToken();

  const { styles } = createStyles(({}) => {
    return {
      outside: {
        borderRadius: 8,
      },
      body: {
        backgroundPosition: '100% -30%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '274px auto',
      },
      title: {
        fontSize: '20px',
        color: token.colorTextHeading,
      },
      desc: {
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        marginTop: 16,
        marginBottom: 32,
        width: '65%',
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
      },
    };
  })();

  // test ws
  const test = () => {
    console.log(1);
    const uid = Cookies.get('uid');
    const tid = Cookies.get('tid');
    const room = 1;
    const ws = new WebSocket(`ws://localhost:9011/voice/ws?uid=${uid}&tid=${tid}&room=${room}`);
    ws.onopen = () => {
      console.log('websocket 建立');
    };
    ws.onclose = () => {
      console.log('websocket 关闭');
    };
    ws.onerror = (event: Event) => {
      console.log('websocket 异常：', event);
    };
    ws.onmessage = async ({ data }: MessageEvent<Blob>) => {
      console.log('websocket message:', data);
      const uid = getInt32FromBlob(await data.slice(0, 4).arrayBuffer());
      const voice = await data.slice(4).arrayBuffer();
      console.log('uid', uid);
      console.log('voice', voice);

      const audioContext = new AudioContext();

      // 创建 AudioBufferSourceNode
      const audioSource = audioContext.createBufferSource();

      // 解码 ArrayBuffer
      audioContext.decodeAudioData(voice, (buffer) => {
        // 设置音频源的音频数据
        audioSource.buffer = buffer;

        // 连接音频源到音频输出
        audioSource.connect(audioContext.destination);

        // 播放音频
        audioSource.start();
      });
    };
    console.log(2);
  };

  return (
    <PageContainer>
      <Button type="primary" onClick={() => test()}>
        test
      </Button>
      <Card className={styles.outside}>
        <div className={styles.body}>
          <div className={styles.title}>欢迎使用 Gill Platform</div>
          <p className={styles.desc}>目前处于测试阶段，欢迎各位使用与测试。</p>
          <div className={styles.wrapper}>
            <InfoCard
              index={1}
              href="/voice-chat"
              title="语音聊天"
              desc="提供多对多的实时语音聊天房间"
              visible={true}
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Index;
