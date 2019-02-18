import React, { Component } from 'react'
import {
  BackHandler,
  View,
  TextInput,
  Switch,
  Keyboard,
  Alert,
  ScrollView
} from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker-nevo'
import padWithZeros from '../../helpers/pad-time-with-zeros'

import { getPreviousTemperature, saveSymptom } from '../../../db'
import styles from '../../../styles'
import { LocalTime, ChronoUnit } from 'js-joda'
import { temperature as labels } from '../../../i18n/en/cycle-day'
import { scaleObservable } from '../../../local-storage'
import { shared as sharedLabels } from '../../../i18n/en/labels'
import ActionButtonFooter from './action-button-footer'
import config from '../../../config'
import SymptomSection from './symptom-section'
import Header from '../../header'
import { dirtyAlert } from './dirtyAlert'


const minutes = ChronoUnit.MINUTES

export default class Temp extends Component {
  backListener = () => null

  constructor(props) {
    super(props)
    const cycleDay = props.cycleDay
    this.temperature = cycleDay && cycleDay.temperature
    this.makeActionButtons = props.makeActionButtons

    const temp = this.temperature

    this.state = {
      exclude: temp ? temp.exclude : false,
      time: temp ? temp.time : LocalTime.now().truncatedTo(minutes).toString(),
      isTimePickerVisible: false,
      outOfRange: null,
      note: temp ? temp.note : null,
      dirty: false
    }

    if (temp) {
      this.state.temperature = temp.value.toString()
      if (temp.value === Math.floor(temp.value)) {
        this.state.temperature = `${this.state.temperature}.0`
      }
    } else {
      const prevTemp = getPreviousTemperature(this.props.date)
      if (prevTemp) {
        this.state.temperature = prevTemp.toString()
        this.state.isSuggestion = true
      }
    }
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

  saveTemperature = () => {
    const dataToSave = {
      value: Number(this.state.temperature),
      exclude: this.state.exclude,
      time: this.state.time,
      note: this.state.note
    }
    saveSymptom('temperature', this.props.date, dataToSave)
    this.props.navigate('CycleDay', {date: this.props.date})
  }

  checkRangeAndSave = () => {
    const value = Number(this.state.temperature)

    const absolute = {
      min: config.temperatureScale.min,
      max: config.temperatureScale.max
    }
    const scale = scaleObservable.value
    let warningMsg
    if (value < absolute.min || value > absolute.max) {
      warningMsg = labels.outOfAbsoluteRangeWarning
    } else if (value < scale.min || value > scale.max) {
      warningMsg = labels.outOfRangeWarning
    }

    if (warningMsg) {
      Alert.alert(
        sharedLabels.warning,
        warningMsg,
        [
          { text: sharedLabels.cancel },
          { text: sharedLabels.save, onPress: this.saveTemperature}
        ]
      )
    } else {
      this.saveTemperature()
    }

  }


  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header {...this.props} goBack={() => dirtyAlert(this.state.dirty, this.props.goBack)} />
        
        <ScrollView style={styles.page}>
          <View>
            <SymptomSection
              header={labels.temperature.header}
              explainer={labels.temperature.explainer}
              inline={true}
            >
              <TempInput
                value={this.state.temperature}
                setState={(val) => this.setState({...val, dirty: true })}
                isSuggestion={this.state.isSuggestion}
              />
            </SymptomSection>
            <SymptomSection
              header={labels.time}
              inline={true}
            >
              <TextInput
                style={styles.temperatureTextInput}
                onFocus={() => {
                  Keyboard.dismiss()
                  this.setState({ isTimePickerVisible: true })
                }}
                value={this.state.time}
              />
              <DateTimePicker
                mode="time"
                isVisible={this.state.isTimePickerVisible}
                onConfirm={jsDate => {
                  this.setState({
                    time: padWithZeros(jsDate),
                    isTimePickerVisible: false,
                    dirty: true
                  })
                }}
                onCancel={() => this.setState({ isTimePickerVisible: false })}
              />
            </SymptomSection>
            <SymptomSection
              header={labels.note.header}
              explainer={labels.note.explainer}
            >
              <TextInput
                multiline={true}
                autoFocus={this.state.focusTextArea}
                placeholder={sharedLabels.enter}
                value={this.state.note}
                onChangeText={(val) => {
                  this.setState({ note: val, dirty: true })
                }}
              />
            </SymptomSection>
            <SymptomSection
              header={labels.exclude.header}
              explainer={labels.exclude.explainer}
              inline={true}
            >
              <Switch
                onValueChange={(val) => {
                  this.setState({ exclude: val })
                }}
                value={this.state.exclude}
              />
            </SymptomSection>
          </View>
        </ScrollView>
        <ActionButtonFooter
          symptom='temperature'
          date={this.props.date}
          currentSymptomValue={this.temperature}
          saveAction={() => this.checkRangeAndSave()}
          saveDisabled={
            this.state.temperature === '' ||
            isNaN(Number(this.state.temperature)) ||
            isInvalidTime(this.state.time)
          }
          navigate={this.props.navigate}
          autoShowDayView={false}
        />
      </View>
    )
  }
}

class TempInput extends Component {
  render() {
    const style = [styles.temperatureTextInput]
    if (this.props.isSuggestion) {
      style.push(styles.temperatureTextInputSuggestion)
    }
    return (
      <TextInput
        style={style}
        onChangeText={(val) => {
          if (isNaN(Number(val))) return
          this.props.setState({ temperature: val, isSuggestion: false })
        }}
        keyboardType='numeric'
        value={this.props.value}
        onBlur={this.checkRange}
        autoFocus={true}
      />
    )
  }
}

function isInvalidTime(timeString) {
  try {
    LocalTime.parse(timeString)
  } catch (err) {
    return true
  }
  return false
}