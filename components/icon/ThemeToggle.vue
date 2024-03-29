<script setup lang="ts">
import { useElementHover } from '@vueuse/core'

const props = withDefaults(defineProps<{
  hover: boolean
}>(), {
  hover: false,
})

const { isDark } = useTheme()

const buttonRef = shallowRef<HTMLButtonElement>()
const isElementHover = useElementHover(buttonRef)
const resolvedHover = computed(() => {
  return props.hover && isElementHover.value
})

const toggleState = computed(() => {
  if (isDark.value)
    return resolvedHover.value ? '' : 'theme-toggle--toggled'

  else
    return resolvedHover.value ? 'theme-toggle--toggled' : ''
})
</script>

<template>
  <button
    ref="buttonRef"
    class="theme-toggle"
    :class="toggleState"
    type="button"
    title="Toggle theme"
    aria-label="Toggle theme"
    @click="isDark = !isDark"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="1em"
      height="1em"
      fill="currentColor"
      class="theme-toggle__horizon"
      viewBox="0 0 32 32"
    >
      <clipPath id="theme-toggle__horizon__mask">
        <path d="M0 0h32v29h-32z" />
      </clipPath>
      <path d="M30.7 29.9H1.3c-.7 0-1.3.5-1.3 1.1 0 .6.6 1 1.3 1h29.3c.7 0 1.3-.5 1.3-1.1.1-.5-.5-1-1.2-1z" />
      <g clip-path="url(#theme-toggle__horizon__mask)">
        <path d="M16 8.8c-3.4 0-6.1 2.8-6.1 6.1s2.7 6.3 6.1 6.3 6.1-2.8 6.1-6.1-2.7-6.3-6.1-6.3zm13.3 11L26 15l3.3-4.8c.3-.5.1-1.1-.5-1.2l-5.7-1-1-5.7c-.1-.6-.8-.8-1.2-.5L16 5.1l-4.8-3.3c-.5-.4-1.2-.1-1.3.4L8.9 8 3.2 9c-.6.1-.8.8-.5 1.2L6 15l-3.3 4.8c-.3.5-.1 1.1.5 1.2l5.7 1 1 5.7c.1.6.8.8 1.2.5L16 25l4.8 3.3c.5.3 1.1.1 1.2-.5l1-5.7 5.7-1c.7-.1.9-.8.6-1.3zM16 22.5A7.6 7.6 0 0 1 8.3 15c0-4.2 3.5-7.5 7.7-7.5s7.7 3.4 7.7 7.5c0 4.2-3.4 7.5-7.7 7.5z" />
      </g>
    </svg>
  </button>
</template>

<style>
.theme-toggle.theme-toggle--reversed .theme-toggle__horizon {
  transform: scale(1, -1);
}

.theme-toggle {
  --theme-toggle__horizon--duration: 500ms;
}
.theme-toggle__horizon g path {
  transition: transform var(--theme-toggle__horizon--duration)
    cubic-bezier(0, 0, 0.15, 1);
}

.theme-toggle--toggled:not(label).theme-toggle .theme-toggle__horizon g path,
.theme-toggle input[type='checkbox']:checked ~ .theme-toggle__horizon g path {
  transform: translate3d(0, 50%, 0);
}

.theme-toggle {
  border: none;
  background: none;
  cursor: pointer;
}
.theme-toggle input[type='checkbox'] {
  display: none;
}
.theme-toggle .theme-toggle-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle:not(.theme-toggle--force-motion) * {
    transition: none !important;
  }
}
</style>
