<script lang="ts">
  import P5 from 'p5-svelte';

  export let noiseMultiplier = 1;
  let currentNoiseMultiplier = noiseMultiplier;

  const noiseMax = .2;
  const blobSize = 300;
  const rotationSpeed = 0.0095;

  const sketch = (p5: any) => {
    let phase = 0;

    p5.setup = () => {
      p5.createCanvas(blobSize + 400, blobSize + 400, p5.WEBGL);
      p5.smooth();
      p5.pixelDensity(1);
    };

    p5.draw = () => {
      currentNoiseMultiplier = p5.lerp(currentNoiseMultiplier, noiseMultiplier, 0.1);
      const currentScale = currentNoiseMultiplier / 2;

      p5.clear();
      p5.rotateX(p5.frameCount * rotationSpeed);
      p5.rotateY(p5.frameCount * rotationSpeed);
      p5.scale(currentScale);

      for (let lat = 0; lat <= 180; lat += 4) {
        p5.push();
        p5.rotateZ(p5.frameCount * rotationSpeed * (lat / 180));

        for (let lon = 0; lon <= 360; lon += 4) {
          const r = blobSize + p5.map(
            p5.noise(
              p5.sin(p5.radians(lon)) * noiseMax * currentNoiseMultiplier,
              p5.cos(p5.radians(lon)) * noiseMax * currentNoiseMultiplier,
              p5.sin(p5.radians(lat)) * noiseMax * phase
            ),
            0,
            1,
            -120,
            90
          );

          const x = r * p5.sin(p5.radians(lat)) * p5.cos(p5.radians(lon));
          const y = r * p5.sin(p5.radians(lat)) * p5.sin(p5.radians(lon));
          const z = r * p5.cos(p5.radians(lat));

          p5.push();
          p5.translate(x, y, z);
          p5.noStroke(0);
          p5.fill(20, 200);
          p5.sphere(300);
          p5.pop();
        }
        p5.pop();
      }

      phase += 0.03;
    };
  };
</script>

<div class="canvas-container">
  <P5 {sketch} />
</div>

<style>
  .canvas-container {
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }
</style>
