<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';
  import Blob from '$lib/components/Blob.svelte';

  const { messages, input, handleSubmit } = useChat({ maxSteps: 5 });
  let noiseMultiplier = 1;

  async function handleFormSubmit(event: SubmitEvent) {
    await handleSubmit(event);  // Call the original handleSubmit

    // noiseMultiplier = 0.02;  // Increase noise on submit

    setTimeout(() => {
      noiseMultiplier = 0.2;
    }, 100);
  }

  function handleMessageParts(part : any) {
    switch (part.type) {
      case "text":
        const words = part.text.split(" ");
        let currentIndex = 0;

        // Start with high noise
        noiseMultiplier = .15;

        const animateNoise = () => {
          if (currentIndex < words.length) {
            // Lerp from current noise to target (0.04)
            noiseMultiplier = noiseMultiplier * 0.5 + 0.15 * 0.6;
            currentIndex++;
            requestAnimationFrame(animateNoise);
          } else {
            // Ensure we end at exactly 0.04
            noiseMultiplier = 0.15;
          }
        };

        requestAnimationFrame(animateNoise);
        return part.text;
      case "reasoning":
      case "tool-invocation":
        return JSON.stringify(part, null, 2)
      default:
        return part.content;
    }
  }

</script>

<main>
  <Blob {noiseMultiplier} />

  <ul>
    {#each $messages as message}
      <li>
        {message.role}:
        {#if message.parts}
          {#each message.parts as part (part.type)}
            {handleMessageParts(part)}
          {/each}
        {:else}
          {message.content}
        {/if}
      </li>
    {/each}
  </ul>
  <form on:submit={handleFormSubmit}>
    <input
      bind:value={$input}
    />
    <button type="submit">Send</button>
  </form>
</main>
