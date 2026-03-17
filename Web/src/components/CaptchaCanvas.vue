<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    code: string;
    width?: number;
    height?: number;
  }>(),
  {
    width: 128,
    height: 44,
  },
);

const emit = defineEmits<{
  refresh: [];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const randomColor = (min: number, max: number) => {
  const clamp = (value: number) => Math.max(min, Math.min(max, value));
  const channel = () => clamp(Math.floor(Math.random() * (max - min + 1)) + min);
  return `rgb(${channel()}, ${channel()}, ${channel()})`;
};

const drawCaptcha = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, props.width, props.height);
  context.fillStyle = "#f6f9ff";
  context.fillRect(0, 0, props.width, props.height);

  for (let i = 0; i < 8; i += 1) {
    context.strokeStyle = randomColor(180, 230);
    context.beginPath();
    context.moveTo(Math.random() * props.width, Math.random() * props.height);
    context.lineTo(Math.random() * props.width, Math.random() * props.height);
    context.stroke();
  }

  for (let i = 0; i < props.code.length; i += 1) {
    const char = props.code[i] ?? "";
    const x = 18 + i * 24;
    const y = props.height / 2 + 8;
    const rotation = (Math.random() - 0.5) * 0.5;

    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.font = "700 22px Georgia, serif";
    context.fillStyle = randomColor(40, 120);
    context.fillText(char, 0, 0);
    context.restore();
  }

  for (let i = 0; i < 20; i += 1) {
    context.fillStyle = randomColor(150, 220);
    context.beginPath();
    context.arc(Math.random() * props.width, Math.random() * props.height, 1.2, 0, Math.PI * 2);
    context.fill();
  }
};

onMounted(drawCaptcha);
watch(() => props.code, drawCaptcha);
</script>

<template>
  <button type="button" class="captcha-canvas" @click="emit('refresh')">
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </button>
</template>

<style scoped>
.captcha-canvas {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #d6e4ff;
  border-radius: 14px;
  background: #f6f9ff;
  cursor: pointer;
  overflow: hidden;
}

.captcha-canvas canvas {
  display: block;
}
</style>
