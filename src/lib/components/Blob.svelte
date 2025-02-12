<script lang="ts">
  import P5 from 'p5-svelte';

  // Adjusted values for more liquid-like movement
  const noiseMax = .5;    // Increased by 10% from 3.5
  const blobSize = 40;    // Increased by 20% from 100
  const rotationSpeed = 0.005;  // Increased by 10% from 0.0045

  const sketch = (p5: any) => {
    let phase = 0;
    let currentPoles = 1;
    let targetPoles = 1;
    let poleTransitionTime = 0;

    p5.setup = () => {
      p5.createCanvas(400, 400, p5.WEBGL);
      p5.smooth();
      p5.pixelDensity(1); // Set pixel density for consistent pixelation
    };

    p5.draw = () => {
      p5.clear();  // Clear the canvas without setting a background color
      p5.rotateX(p5.frameCount * rotationSpeed);
      p5.rotateY(p5.frameCount * rotationSpeed);

      // Update pole count
      if (p5.frameCount % 120 === 0) { // Change every ~2 seconds
        targetPoles = Math.floor(p5.random(1, 8)); // Random number between 1-7 poles
        poleTransitionTime = 0;
      }

      // Smooth transition between pole counts
      poleTransitionTime += 0.02;
      currentPoles = p5.lerp(currentPoles, targetPoles, poleTransitionTime);

      // First pass: Draw darker outline spheres
      for (let lat = 0; lat <= 180; lat += 4) {  // Increased density from 6 to 4
        for (let lon = 0; lon <= 360; lon += 4) {  // Increased density from 6 to 4
          const poleEffect = Math.sin(currentPoles * p5.radians(lon)) * 0.5;

          const r = blobSize + p5.map(
            p5.noise(
              p5.sin(p5.radians(lon)) * noiseMax,
              p5.cos(p5.radians(lon)) * noiseMax,
              p5.sin(p5.radians(lat)) * noiseMax + phase
            ),
            0,
            1,
            -80,    // Increased negative range to allow inversion
            60      // Increased positive range for more dramatic effects
          ) + (poleEffect * 40); // Add pole deformation

          const x = r * p5.sin(p5.radians(lat)) * p5.cos(p5.radians(lon));
          const y = r * p5.sin(p5.radians(lat)) * p5.sin(p5.radians(lon));
          const z = r * p5.cos(p5.radians(lat));

          p5.push();
          p5.translate(x, y, z);
          p5.noStroke();
          p5.fill(0, 200); // Darker gray with higher opacity
          p5.sphere(.5); // 3px diameter for outline
          p5.pop();
        }
      }

      // Second pass: Draw inner white spheres
      for (let lat = 0; lat <= 180; lat += 4) {  // Increased density from 6 to 4
        for (let lon = 0; lon <= 360; lon += 4) {  // Increased density from 6 to 4
          const poleEffect = Math.sin(currentPoles * p5.radians(lon)) * 0.5;

          const r = blobSize + p5.map(
            p5.noise(
              p5.sin(p5.radians(lon)) * noiseMax,
              p5.cos(p5.radians(lon)) * noiseMax,
              p5.sin(p5.radians(lat)) * noiseMax + phase
            ),
            0,
            1,
            -80,    // Increased negative range to allow inversion
            60      // Increased positive range for more dramatic effects
          ) + (poleEffect * 40); // Add pole deformation

          const x = r * p5.sin(p5.radians(lat)) * p5.cos(p5.radians(lon));
          const y = r * p5.sin(p5.radians(lat)) * p5.sin(p5.radians(lon));
          const z = r * p5.cos(p5.radians(lat));

          p5.push();
          p5.translate(x, y, z);
          p5.noStroke();
          p5.fill(255, 60); // White with lower opacity
          p5.sphere(1); // 2px diameter for inner spheres
          p5.pop();
        }
      }

      phase += 0.033;  // Increased by 10% from 0.03
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
    image-rendering: pixelated; /* Add pixelation effect */
  }
</style>
