/**
 * 使用输入设备
 *
 * @param audioContext context
 * @param inputStream 输入流
 * @param onmessage 输入流事件
 */
export const useInputDevice = (
  audioContext: AudioContext,
  inputStream: MediaStream,
  onmessage: (event: MessageEvent<any>) => void,
) => {
  const streamSource = audioContext.createMediaStreamSource(inputStream);
  const audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-input-processor');
  const messagePort = audioWorkletNode.port;
  messagePort.onmessage = onmessage;
  streamSource.connect(audioWorkletNode);
  // streamSource.connect(audioContext.destination);
};
