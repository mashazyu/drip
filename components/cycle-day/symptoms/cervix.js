import React, { Component } from 'react'
import {
  BackHandler,
  View,
  Switch,
  ScrollView
} from 'react-native'
import styles from '../../../styles'
import { saveSymptom } from '../../../db'
import { cervix as labels } from '../../../i18n/en/cycle-day'
import ActionButtonFooter from './action-button-footer'
import SelectTabGroup from '../select-tab-group'
import SymptomSection from './symptom-section'
import { ActionHint } from '../../app-text'
import Header from '../../header'
import { dirtyAlert } from './dirtyAlert'

export default class Cervix extends Component {
  backListener = null

  constructor(props) {
    super(props)
    const cycleDay = props.cycleDay
    this.cervix = cycleDay && cycleDay.cervix
    this.makeActionButtons = props.makeActionButtons
    this.state = this.cervix ? this.cervix : {}
  }

  componentDidMount () {
    this.backListener = BackHandler.addEventListener('hardwareBackPress', () => {
      dirtyAlert(this.state.dirty, this.props.goBack)
      return true
    })
  }

  componentDidUnmout () {
    BackHandler.removeEventListener('hardwareBackPress', this.backListener)
  }

  render() {
    const cervixOpeningRadioProps = [
      { label: labels.opening.categories[0], value: 0 },
      { label: labels.opening.categories[1], value: 1 },
      { label: labels.opening.categories[2], value: 2 }
    ]
    const cervixFirmnessRadioProps = [
      { label: labels.firmness.categories[0], value: 0 },
      { label: labels.firmness.categories[1], value: 1 }
    ]
    const cervixPositionRadioProps = [
      { label: labels.position.categories[0], value: 0 },
      { label: labels.position.categories[1], value: 1 },
      { label: labels.position.categories[2], value: 2 }
    ]
    const mandatoryNotCompletedYet = typeof this.state.opening != 'number' || typeof this.state.firmness != 'number'
    return (
      <View style={{ flex: 1 }}>
        <Header {...this.props} goBack={() => dirtyAlert(this.state.dirty, this.props.goBack)} />

        <ScrollView style={styles.page}>
          <SymptomSection
            header="Opening"
            explainer={labels.opening.explainer}
          >
            <SelectTabGroup
              buttons={cervixOpeningRadioProps}
              active={this.state.opening}
              onSelect={val => this.setState({ opening: val, dirty: true })}
            />
          </SymptomSection>
          <SymptomSection
            header="Firmness"
            explainer={labels.firmness.explainer}
          >
            <SelectTabGroup
              buttons={cervixFirmnessRadioProps}
              active={this.state.firmness}
              onSelect={val => this.setState({ firmness: val, dirty: true })}
            />
          </SymptomSection>
          <SymptomSection
            header="Position"
            explainer={labels.position.explainer}
          >
            <SelectTabGroup
              buttons={cervixPositionRadioProps}
              active={this.state.position}
              onSelect={val => this.setState({ position: val, dirty: true })}
            />
          </SymptomSection>
          <SymptomSection
            header="Exclude"
            explainer="You can exclude this value if you don't want to use it for fertility detection"
            inline={true}
          >
            <Switch
              onValueChange={(val) => {
                this.setState({ exclude: val })
              }}
              value={this.state.exclude}
            />
          </SymptomSection>
        </ScrollView>
        <ActionHint isVisible={mandatoryNotCompletedYet}>{labels.actionHint}</ActionHint>
        <ActionButtonFooter
          symptom='cervix'
          date={this.props.date}
          currentSymptomValue={this.cervix}
          saveAction={() => {
            this.setState({ dirty: false })
            saveSymptom('cervix', this.props.date, {
              opening: this.state.opening,
              firmness: this.state.firmness,
              position: this.state.position,
              exclude: Boolean(this.state.exclude)
            })
          }}
          saveDisabled={mandatoryNotCompletedYet}
          navigate={this.props.navigate}
        />
      </View>
    )
  }
}
