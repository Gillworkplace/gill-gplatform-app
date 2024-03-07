class AudioInputProcessor extends AudioWorkletProcessor {

  lastTimestamp = Date.now()
  period = 200
  sampleBuffer = []

  process(inputs, outputs, parameters) {
    if (inputs.length > 0 && inputs[0].length > 0) {
      const inputData = inputs[0][0]; // 获取当前声道的输入数据
      this.sampleBuffer.push(...inputData);
      let now = Date.now();
      if (now >= this.lastTimestamp + this.period) {
        this.port.postMessage(this.sampleBuffer);
        this.sampleBuffer = [];
        this.lastTimestamp = now;
      }
    }
    return true;
  }
}

class AudioOutputProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    for (let channel = 0; channel < input.length; ++channel) {
      const inputData = input[channel];
      const outputData = output[channel];

      // 复制输入数据到输出数据
      for (let i = 0; i < inputData.length; ++i) {
        outputData[i] = inputData[i];
      }
    }
    return true;
  }
}

registerProcessor('audio-input-processor', AudioInputProcessor);
registerProcessor('audio-output-processor', AudioOutputProcessor);
