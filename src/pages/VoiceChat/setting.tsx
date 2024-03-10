export const AudioSetting = {
  sampleRate: 44100,
  sampleSizeInBits: 16,
  channels: 2,
  frameSize: 4,
  frameRate: 44100,
};

export const WebRtcSetting: RTCConfiguration = {
  bundlePolicy: 'max-bundle',
  iceTransportPolicy: 'relay',
  iceServers: [
    {
      urls: ['turn:8.147.106.47:11816'],
      username: 'gill',
      credential: '123456',
    },
  ],
};
