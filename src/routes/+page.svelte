<script lang="ts">
  import { useChat } from '@ai-sdk/svelte';
  import Blob from '$lib/components/Blob.svelte';

  const { messages, input, handleSubmit } = useChat({ maxSteps: 5 });

  function handleMessageParts(part : any) {
    switch (part.type) {
      case "text":
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
  <Blob />

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
  <form on:submit={handleSubmit}>
    <input bind:value={$input} />
    <button type="submit">Send</button>
  </form>
</main>

<style>
  main {
    padding: 2rem;
  }
</style>
