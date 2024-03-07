import AudioMesh from '@/pages/VoiceChat/components/audio-mesh';
import { Button, Select } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';

type Props = {
  roomId: number;
  roomPassword?: string;
  onExit?: () => void;
};

type Device = {
  deviceId: string;
  name: string;
};

const AudioRoom: React.FC<Props> = (props) => {
  const { styles } = createStyles(({}) => {
    return {
      container: {},
    };
  })();

  const [inputDevices, setInputDevices] = useState<Device[]>([]);
  const [inputDevice, setInputDevice] = useState<string>('default');
  const [outputDevices, setOutputDevices] = useState<Device[]>([]);
  const [outputDevice, setOutputDevice] = useState<string>('default');

  // const [audioContext, setAudioContext] = useState<AudioContext>()

  /**
   * 加载媒体设备数据
   */
  const loadDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs: Device[] = [];
    const outputs: Device[] = [];
    for (let i = 0; i < devices.length; i++) {
      const device = {
        deviceId: devices[i].deviceId,
        name: devices[i].label,
      };
      const deviceType = devices[i].kind;
      if (deviceType === 'audioinput') {
        inputs.push(device);
      } else if (deviceType === 'audiooutput') {
        outputs.push(device);
      }
    }
    setInputDevices(inputs);
    setOutputDevices(outputs);
  };

  const changeInputDevice = (deviceId: string) => {
    setInputDevice(deviceId);
  };

  const changeOutputDevice = (deviceId: string) => {
    setOutputDevice(deviceId);
  };

  useEffect(() => {
    loadDevices();
    // const context = new AudioContext({
    //   sampleRate: AudioSetting.sampleRate,
    // })
    // // context.audioWorklet.addModule('scripts/audio-processor.js')
    // // setAudioContext(context);
    // return () => {
    //   context.close();
    // }
  }, []);

  return (
    <div className={styles.container}>
      <AudioMesh roomId={props.roomId} roomPassword={props.roomPassword} />
      <Button type="primary" size="large" htmlType="button" onClick={props.onExit}>
        退出房间
      </Button>
      <Select
        defaultValue={inputDevice}
        onChange={(value) => changeInputDevice(value)}
        options={inputDevices.map((d) => ({ value: d.deviceId, label: d.name }))}
      />
      <Select
        defaultValue={outputDevice}
        onChange={(value) => changeOutputDevice(value)}
        options={outputDevices.map((d) => ({ value: d.deviceId, label: d.name }))}
      />
    </div>
  );
};

export default AudioRoom;
