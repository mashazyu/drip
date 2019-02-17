import React, { Component } from 'react'
import {
  TextInput,
  View,
  ScrollView
} from 'react-native'
import styles from '../../../styles'
import { saveSymptom } from '../../../db'
import { sex as sexLabels, contraceptives as contraceptivesLabels } from '../../../i18n/en/cycle-day'
import { shared as sharedLabels } from '../../../i18n/en/labels'
import ActionButtonFooter from './action-button-footer'
import SelectBoxGroup from '../select-box-group'
import SymptomSection from './symptom-section'
import Header from '../../header'
import { dirtyAlert } from './dirtyAlert'

export default class Sex extends Component {
  constructor(props) {
    super(props)
    const cycleDay = props.cycleDay
    if (cycleDay && cycleDay.sex) {
      this.state = Object.assign({}, cycleDay.sex)
    } else {
      this.state = {}
    }
    // We make sure other is always true when there is a note,
    // e.g. when import is messed up.
    if (this.state.note) this.state.other = true
  }

  toggleState = (key) => {
    const curr = this.state[key]
    this.setState({
      [key]: !curr,
      dirty: true
    })
    if (key === 'other' && !curr) {
      this.setState({
        focusTextArea: true,
        dirty: true
      })
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header {...this.props} goBack={() => dirtyAlert(this.state.dirty, this.props.goBack)} />

        <ScrollView style={styles.page}>
          <SymptomSection
            header={sexLabels.header}
            explainer={sexLabels.explainer}
          >
            <SelectBoxGroup
              labels={sexLabels.categories}
              onSelect={this.toggleState}
              optionsState={this.state}
            />
          </SymptomSection>
          <SymptomSection
            header={contraceptivesLabels.header}
            explainer={contraceptivesLabels.explainer}
          >
            <SelectBoxGroup
              labels={contraceptivesLabels.categories}
              onSelect={this.toggleState}
              optionsState={this.state}
            />
          </SymptomSection>

          {this.state.other &&
            <TextInput
              autoFocus={this.state.focusTextArea}
              multiline={true}
              placeholder={sharedLabels.enter}
              value={this.state.note}
              onChangeText={(val) => {
                this.setState({
                  note: val,
                  dirty: true
                })
              }}
            />
          }
        </ScrollView>
        <ActionButtonFooter
          symptom='sex'
          date={this.props.date}
          currentSymptomValue={this.state}
          saveAction={() => {
            this.setState({ dirty: false })
            const copyOfState = Object.assign({}, this.state)
            if (!copyOfState.other) {
              copyOfState.note = null
            }
            saveSymptom('sex', this.props.date, copyOfState)
          }}
          saveDisabled={Object.values(this.state).every(value => !value)}
          navigate={this.props.navigate}
        />
      </View>
    )
  }
}
