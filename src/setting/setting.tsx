/** @jsx jsx */
import { React, css } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import {
  MapWidgetSelector,
  SettingSection,
  SettingRow
} from 'jimu-ui/advanced/setting-components'
import { TextInput, Switch } from 'jimu-ui'
import type { IMConfig } from '../config'
import defaultMessages from './translations/default'

interface SwitchRowProps {
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function SwitchRow (props: SwitchRowProps) {
  return (
    <SettingRow flow="wrap">
      <div className="switch-row">
        <div>
          <label>{props.label}</label>
          {props.hint && <div className="switch-row__hint">{props.hint}</div>}
        </div>
        <Switch checked={props.checked} onChange={evt => props.onChange(evt.target.checked)} />
      </div>
    </SettingRow>
  )
}

export default function Setting (props: AllWidgetSettingProps<IMConfig>) {
  const { config } = props

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({ id: props.id, useMapWidgetIds })
  }

  const onConfigChange = (key: string, value: unknown) => {
    props.onSettingChange({ id: props.id, config: config.set(key, value) })
  }

  const style = css`
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 8px;
    }

    .switch-row__hint {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-top: 2px;
    }

    .field-row {
      width: 100%;
    }

    .field-row input,
    .field-row textarea {
      width: 100%;
    }
  `

  return (
    <div css={style}>
      <SettingSection title={defaultMessages.mapSection}>
        <SettingRow>
          <MapWidgetSelector
            useMapWidgetIds={props.useMapWidgetIds}
            onSelect={onMapWidgetSelected}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title={defaultMessages.appearanceSection}>
        <SettingRow flow="wrap">
          <div className="field-row">
            <label>{defaultMessages.headingLabel}</label>
            <TextInput
              value={config.heading}
              onChange={evt => onConfigChange('heading', evt.target.value)}
            />
          </div>
        </SettingRow>

        <SettingRow flow="wrap">
          <div className="field-row">
            <label>{defaultMessages.descriptionLabel}</label>
            <TextInput
              value={config.description}
              onChange={evt => onConfigChange('description', evt.target.value)}
            />
          </div>
        </SettingRow>

        <SettingRow flow="wrap">
          <div className="field-row">
            <label>{defaultMessages.entryMessageLabel}</label>
            <textarea
              rows={3}
              value={config.entryMessage}
              onChange={evt => onConfigChange('entryMessage', evt.target.value)}
            />
          </div>
        </SettingRow>

        <SwitchRow
          label={defaultMessages.keepSuggestedPromptsLabel}
          hint={defaultMessages.keepSuggestedPromptsHint}
          checked={config.keepSuggestedPrompts}
          onChange={checked => onConfigChange('keepSuggestedPrompts', checked)}
        />
      </SettingSection>

      <SettingSection title={defaultMessages.agentsSection}>
        <SwitchRow
          label={defaultMessages.navigationAgentLabel}
          hint={defaultMessages.navigationAgentHint}
          checked={config.enableNavigationAgent}
          onChange={checked => onConfigChange('enableNavigationAgent', checked)}
        />
        <SwitchRow
          label={defaultMessages.dataExplorationAgentLabel}
          hint={defaultMessages.dataExplorationAgentHint}
          checked={config.enableDataExplorationAgent}
          onChange={checked => onConfigChange('enableDataExplorationAgent', checked)}
        />
        <SwitchRow
          label={defaultMessages.helpAgentLabel}
          hint={defaultMessages.helpAgentHint}
          checked={config.enableHelpAgent}
          onChange={checked => onConfigChange('enableHelpAgent', checked)}
        />
      </SettingSection>
    </div>
  )
}
