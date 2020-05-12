import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, StyleSheet, View } from 'react-native'

import AppModal from '../common/app-modal'
import AppSwitch from '../common/app-switch'
import AppText from '../common/app-text'
import Button from '../common/button'
import Segment from '../common/segment'
import SelectTabGroup from './select-tab-group'

import { connect } from 'react-redux'
import { getDate } from '../../slices/date'
import { symtomPage } from '../helpers/cycle-day'
import { saveSymptom } from '../../db'
import { getLabelsList } from '../helpers/labels'

import info from '../../i18n/en/symptom-info'
import { Containers, Fonts, Sizes } from '../../styles/redesign'

class SymptomEditView extends Component {

  static propTypes = {
    date: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    symptom: PropTypes.string.isRequired,
    symptomData: PropTypes.object
  }

  constructor(props) {
    super(props)

    const { symptomData, symptom } = this.props
    const defaultSymptomData = { value: null, exclude: false }
    const data = symptomData ? symptomData : defaultSymptomData
    const shouldShowExclude = symtomPage[symptom].excludeText ? true : false

    this.state = { ...data, shouldShowInfo: false, shouldShowExclude }
  }

  componentDidUpdate() {
    this.saveData()
  }

  onExcludeToggle = () => {
    this.setState({ exclude: !this.state.exclude })
  }

  onRemove = () => {
    this.saveData(true)
    this.props.onClose()
  }

  onSave = () => {
    this.saveData()
    this.props.onClose()
  }

  onPressLearnMore = () => {
    this.setState({ shouldShowInfo: !this.state.shouldShowInfo })
  }

  saveData = (shouldDeleteData) => {
    const { date, symptom } = this.props
    const { exclude, value, shouldShowExclude } = this.state
    const hasValueToSave = typeof value === 'number'
    const valuesToSave = shouldDeleteData || !hasValueToSave ? null : { value }
    if (shouldShowExclude) {
      valuesToSave.exclude = exclude ? true : false
    }

    saveSymptom(symptom, date, valuesToSave)
  }

  render() {
    const { symptom, onClose } = this.props
    const { exclude, shouldShowExclude, shouldShowInfo } = this.state
    const labels = getLabelsList(symtomPage[symptom].options)
    const iconName = shouldShowInfo ? "chevron-down" : "chevron-up"

    return (
      <AppModal onClose={onClose}>
        <ScrollView
          style={styles.modalWindow}
          contentContainerStyle={styles.modalContainer}
        >
          <Segment>
            <AppText style={styles.title}>{symtomPage[symptom].title}</AppText>
            <SelectTabGroup
              buttons={labels}
              activeButton={this.state.value}
              onSelect={value => this.setState({ value })}
            />
          </Segment>
          {shouldShowExclude &&
            <Segment>
              <AppSwitch
                onToggle={this.onExcludeToggle}
                text={symtomPage[symptom].excludeText}
                value={exclude}
              />
            </Segment>
          }
          <View style={styles.buttonsContainer}>
            <Button iconName={iconName} isSmall onPress={this.onPressLearnMore}>
              learn more
            </Button>
            <Button isSmall onPress={this.onRemove}>
              remove
            </Button>
            <Button isCTA isSmall onPress={this.onSave}>save</Button>
          </View>
          {shouldShowInfo &&
            <Segment last>
              <AppText>{info[symptom].text}</AppText>
            </Segment>
          }
        </ScrollView>
      </AppModal>
    )
  }
}

const styles = StyleSheet.create({
  buttonsContainer: {
    ...Containers.rowContainer
  },
  modalContainer: {
    flexGrow: 1,
    padding: Sizes.small
  },
  modalWindow: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: Sizes.huge * 2,
    height: '70%',
    position: 'absolute'
  },
  title: {
    fontSize: Sizes.subtitle,
    fontFamily: Fonts.bold
  }
})

const mapStateToProps = (state) => {
  return({
    date: getDate(state),
  })
}

export default connect(
  mapStateToProps,
  null,
)(SymptomEditView)