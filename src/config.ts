/** @jsx jsx */
import { ImmutableObject } from 'jimu-core'

/**
 * Widget configuration.
 *
 * Everything here is editable from the Experience Builder settings panel, so a
 * builder can rebrand the assistant and switch individual agents on or off
 * without touching code.
 */
export interface Config {
  /** Heading shown at the top of the assistant panel. */
  heading: string
  /** Short description shown under the heading. */
  description: string
  /** Instructions displayed as the first message in the conversation. */
  entryMessage: string
  /** Keep the suggested prompt chips visible after the first question. */
  keepSuggestedPrompts: boolean
  /** Enable the navigation agent (pan/zoom, find places on the map). */
  enableNavigationAgent: boolean
  /** Enable the data exploration agent (query features, statistics, proximity). */
  enableDataExplorationAgent: boolean
  /** Enable the help agent (explains how to use the app). */
  enableHelpAgent: boolean
}

export const defaultConfig: Config = {
  heading: 'AI Assistant',
  description: 'Ask about what you see on the map in plain language.',
  entryMessage:
    'Ask me to take you somewhere on the map, to explore the data in a layer, or to explain how this app works.',
  keepSuggestedPrompts: false,
  enableNavigationAgent: true,
  enableDataExplorationAgent: true,
  enableHelpAgent: true
}

export type IMConfig = ImmutableObject<Config>
