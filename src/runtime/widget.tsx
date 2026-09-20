/** @jsx jsx */
import { type AllWidgetProps, jsx, css } from 'jimu-core'
import { useEffect, useMemo, useRef, useState } from 'react'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'

// Side-effect import: registers <arcgis-assistant>, <arcgis-assistant-navigation-agent>,
// <arcgis-assistant-data-exploration-agent>, <arcgis-assistant-help-agent> and friends.
import '@arcgis/ai-components'

import type { IMConfig } from '../config'
import defaultMessages from './translations/default'

type AiElement = HTMLElement & { referenceElement?: unknown }

/**
 * Resolve the map reference handed to the AI components.
 *
 * Experience Builder exposes the map as a web component through
 * `jimuMapView.mapComponent`, which is what the AI components work against.
 * Older builds only expose the underlying MapView/SceneView, so fall back to its
 * container element, and finally to the view itself.
 */
function resolveMapReference (jimuMapView?: JimuMapView): unknown {
  if (!jimuMapView) {
    return undefined
  }

  const mapComponent = (jimuMapView as unknown as { mapComponent?: unknown }).mapComponent
  if (mapComponent) {
    return mapComponent
  }

  const container = (jimuMapView.view as unknown as { container?: unknown })?.container
  return container ?? jimuMapView.view
}

export default function Widget (props: AllWidgetProps<IMConfig>) {
  const config = props.config
  const useMapWidgetId = props.useMapWidgetIds?.[0]

  const [jimuMapView, setJimuMapView] = useState<JimuMapView>()

  const assistantRef = useRef<AiElement | null>(null)
  const navigationAgentRef = useRef<AiElement | null>(null)
  const dataExplorationAgentRef = useRef<AiElement | null>(null)
  const helpAgentRef = useRef<AiElement | null>(null)

  const mapReference = useMemo(() => resolveMapReference(jimuMapView), [jimuMapView])

  /**
   * The map reference is a live object, not a string. React would stringify it
   * into an attribute, so assign it as a property instead — Lumina/Lit maps the
   * `referenceElement` property to the `reference-element` attribute.
   */
  useEffect(() => {
    const elements: (AiElement | null)[] = [
      assistantRef.current,
      config.enableNavigationAgent ? navigationAgentRef.current : null,
      config.enableDataExplorationAgent ? dataExplorationAgentRef.current : null,
      config.enableHelpAgent ? helpAgentRef.current : null
    ]

    elements.forEach(element => {
      if (element) {
        element.referenceElement = mapReference
      }
    })
  }, [
    mapReference,
    config.enableNavigationAgent,
    config.enableDataExplorationAgent,
    config.enableHelpAgent
  ])

  const style = css`
    .ai-assistant-widget {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      arcgis-assistant {
        height: 100%;
        width: 100%;
      }
    }

    .ai-assistant-widget__placeholder {
      padding: 1rem;
      font-size: 0.875rem;
    }
  `

  if (!useMapWidgetId) {
    return (
      <div css={style}>
        <div className="ai-assistant-widget__placeholder">
          {defaultMessages.selectMapPrompt}
        </div>
      </div>
    )
  }

  return (
    <div css={style}>
      <JimuMapViewComponent
        useMapWidgetId={useMapWidgetId}
        onActiveViewChange={setJimuMapView}
      />

      <div className="ai-assistant-widget">
        <arcgis-assistant
          ref={assistantRef}
          heading={config.heading}
          description={config.description}
          entry-message={config.entryMessage}
          keep-suggested-prompts={config.keepSuggestedPrompts}
        >
          {config.enableNavigationAgent && (
            <arcgis-assistant-navigation-agent ref={navigationAgentRef} />
          )}
          {config.enableDataExplorationAgent && (
            <arcgis-assistant-data-exploration-agent ref={dataExplorationAgentRef} />
          )}
          {config.enableHelpAgent && (
            <arcgis-assistant-help-agent ref={helpAgentRef} />
          )}
        </arcgis-assistant>
      </div>
    </div>
  )
}
