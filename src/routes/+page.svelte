<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';

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
  <ul class="messages-container" bind:this={messageContainer}>
    {#each $messages as message}
      <li>
        <div class="message {message.role}">
          {#if message.role === 'assistant'}
            <span class="role-label assistant-label">assistant</span>
          {/if}
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
    background-color: #e0e5ec;
    min-height: 100vh;
    font-family: monospace;
    line-height: 2.1;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 10rem 2rem;
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
    position: relative;
    max-width: 80%;
    padding: 2rem;
    white-space: pre-wrap;
    margin: 2rem;
    line-height: 2;
  }

  .assistant {
    align-self: flex-start;
    line-height: 2;
    background-color: #e0e5ec;
    color: #2c3e50;
    border-radius: 1rem;
    border-bottom-left-radius: 0.2rem;
    margin-left: 0.5rem;
    box-shadow:
      11px 4px 20px 0px rgb(0 0 0 / 5%),
      -7px -9px 20px 0px rgb(255 255 255 / 43%);
    transition: all 0.2s ease;
  }

  .assistant:hover {
    box-shadow:
      2px 2px 4px rgb(0 0 0 / 3%),
      -2px -2px 4px rgb(255 255 255 / 29%);
    transform: translateY(1px);
  }

  .user {
    align-self: flex-end;
    margin-right: 0.5rem;
    line-height: 2;
    color: #6c6c6c;
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
    height: 1.2rem;
    border: none;
    border-radius: 0.8rem;
    background: #e0e5ec;
    color: #2c3e50;
    box-shadow:
      11px 4px 20px 0px rgb(0 0 0 / 5%),
      -7px -9px 20px 0px rgb(255 255 255 / 43%);
    font-family: monospace;
    line-height: 1.6;
    transition: all 0.2s ease;
  }

  input:hover {
    box-shadow:
      2px 2px 4px rgb(0 0 0 / 3%),
      -2px -2px 4px rgb(255 255 255 / 29%);
    transform: translateY(1px);
  }

  input:focus {
    outline: none;
    box-shadow:
      inset 3px 3px 6px rgb(0 0 0 / 5%),
      inset -3px -3px 6px rgb(255 255 255 / 43%);
  }

  button {
    padding: 0.8rem 1.5rem;
    background-color: #e0e5ec;
    color: #007AFF;
    border: none;
    border-radius: 0.8rem;
    cursor: pointer;
    box-shadow:
      11px 4px 20px 0px rgb(0 0 0 / 5%),
      -7px -9px 20px 0px rgb(255 255 255 / 43%);
    transition: all 0.2s ease;
    font-family: monospace;
    line-height: 1.6;
  }

  button:hover {
    box-shadow:
      2px 2px 4px rgb(0 0 0 / 3%),
      -2px -2px 4px rgb(255 255 255 / 29%);
    transform: translateY(1px);
  }

  button:active {
    box-shadow:
      inset 2px 2px 4px rgba(0, 0, 0, 0.2),
      inset -2px -2px 4px rgba(255, 255, 255, 0.7);
    transform: translateY(2px);
  }

  .role-label {
    position: absolute;
    top: -2.5rem;
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .assistant-label {
    left: 1rem;
    color: #2c3e50;
  }
</style>
