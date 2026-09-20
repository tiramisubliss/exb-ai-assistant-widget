/**
 * Ambient JSX declarations for the ArcGIS AI Components custom elements.
 *
 * @arcgis/ai-components registers its elements at runtime and ships HTML metadata
 * for editors (web-types.json), but no React JSX types. Without these
 * declarations TypeScript rejects the tags in a .tsx file.
 *
 * The index signature is intentional: the elements expose a long list of
 * attributes (heading, entry-message, reference-element, feedback-enabled, ...)
 * that we do not want to mirror by hand.
 */
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type AiElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  [attribute: string]: unknown
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'arcgis-assistant': AiElementProps
      'arcgis-assistant-agent': AiElementProps
      'arcgis-assistant-navigation-agent': AiElementProps
      'arcgis-assistant-data-exploration-agent': AiElementProps
      'arcgis-assistant-help-agent': AiElementProps
      'arcgis-assistant-knowledge-agent': AiElementProps
      'arcgis-assistant-layer-styling-agent': AiElementProps
      'arcgis-assistant-chat': AiElementProps
      'arcgis-assistant-chat-entry': AiElementProps
      'arcgis-assistant-suggested-prompts': AiElementProps
      'arcgis-assistant-message': AiElementProps
      'arcgis-assistant-message-loading': AiElementProps
    }
  }
}

export {}
