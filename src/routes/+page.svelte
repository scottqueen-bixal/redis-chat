<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';
  import Blob from '$lib/components/Blob.svelte';

  const { messages, input, handleSubmit } = useChat({ maxSteps: 5 });
  let noiseMultiplier = 1;

  let messageContainer: HTMLUListElement;

  function scrollToBottom() {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  async function handleFormSubmit(event: SubmitEvent) {
    await handleSubmit(event);  // Call the original handleSubmit

    // Start with high noise on submit
    noiseMultiplier = 1;

    // Scroll to bottom after submitting
    scrollToBottom();

    // Smoothly animate to medium noise
    const animateInitialNoise = () => {
      if (noiseMultiplier > 0.2) {
        noiseMultiplier = noiseMultiplier * 0.8; // Exponential decay
        requestAnimationFrame(animateInitialNoise);
      } else {
        noiseMultiplier = 0.2;
      }
    };

    requestAnimationFrame(animateInitialNoise);
  }

  function handleMessageParts(part : any) {
    // Scroll after a small delay to ensure content is rendered
    setTimeout(scrollToBottom, 100);

    switch (part.type) {
      case "text":
        const words = part.text.split(" ");
        let currentIndex = 0;
        let startNoise = noiseMultiplier;
        const targetNoise = 0.15;

        const animateNoise = () => {
          if (currentIndex < words.length) {
            // Smooth interpolation between current and target noise
            noiseMultiplier = startNoise + (targetNoise - startNoise) *
              (currentIndex / words.length);
            currentIndex++;
            requestAnimationFrame(animateNoise);
          } else {
            noiseMultiplier = targetNoise;
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
  <!-- <Blob {noiseMultiplier} /> -->

  <ul bind:this={messageContainer}>
    {#each $messages as message}
      <li>
        <div class="message {message.role}">
          {#if message.parts}
            {#each message.parts as part (part.type)}
              {handleMessageParts(part)}
            {/each}
          {:else}
            {message.content}
          {/if}
        </div>
      </li>
    {/each}
  </ul>
  <form on:submit={handleFormSubmit}>
    <input
      bind:value={$input}
      placeholder="Type a message..."
    />
    <button type="submit">Send</button>
  </form>
</main>

<style>
  main {
    margin: 0 auto;
    padding: 1rem;
    background-color: #e0e5ec;
    min-height: 100vh;
    font-family: monospace;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;
    padding-bottom: 1rem;
  }

  li {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
  }

  .message {
    max-width: 80%;
    padding: 1rem 1.2rem;
    border-radius: 1rem;
    white-space: pre-wrap;
    margin: 0 1rem;
    box-shadow:
      3px 3px 6px rgba(0, 0, 0, 0.2),
      -3px -3px 6px rgba(255, 255, 255, 0.7);
  }

  .user {
    align-self: flex-end;
    background-color: #e0e5ec;
    color: #007AFF;
    border-bottom-right-radius: 0.2rem;
    margin-right: 0.5rem;
  }

  .assistant {
    align-self: flex-start;
    background-color: #e0e5ec;
    color: #2c3e50;
    border-bottom-left-radius: 0.2rem;
    margin-left: 0.5rem;
  }

  form {
    margin-top: auto;
    display: flex;
    gap: 0.8rem;
    padding: 1rem;
    background-color: #e0e5ec;
  }

  input {
    flex: 1;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 0.8rem;
    background: #e0e5ec;
    color: #2c3e50;
    box-shadow:
      inset 2px 2px 5px rgba(0, 0, 0, 0.2),
      inset -2px -2px 5px rgba(255, 255, 255, 0.7);
    font-family: monospace;
  }

  input:focus {
    outline: none;
    box-shadow:
      inset 3px 3px 6px rgba(0, 0, 0, 0.2),
      inset -3px -3px 6px rgba(255, 255, 255, 0.7);
  }

  button {
    padding: 0.8rem 1.5rem;
    background-color: #e0e5ec;
    color: #007AFF;
    border: none;
    border-radius: 0.8rem;
    cursor: pointer;
    box-shadow:
      3px 3px 6px rgba(0, 0, 0, 0.2),
      -3px -3px 6px rgba(255, 255, 255, 0.7);
    transition: all 0.2s ease;
    font-family: monospace;
  }

  button:hover {
    box-shadow:
      2px 2px 4px rgba(0, 0, 0, 0.2),
      -2px -2px 4px rgba(255, 255, 255, 0.7);
    transform: translateY(1px);
  }

  button:active {
    box-shadow:
      inset 2px 2px 4px rgba(0, 0, 0, 0.2),
      inset -2px -2px 4px rgba(255, 255, 255, 0.7);
    transform: translateY(2px);
  }
</style>
