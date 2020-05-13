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
import { blank, save, shouldShow,symtomPage } from '../helpers/cycle-day'

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
    const data = symptomData ? symptomData : blank[symptom]

    const symptomConfig = symtomPage[symptom]
    const shouldShowExclude = shouldShow(symptomConfig.excludeText)
    const shouldShowNote = shouldShow(symptomConfig.note)
    const shouldBoxGroup = shouldShow(symptomConfig.selectBoxGroups)
    const shouldTabGroup = shouldShow(symptomConfig.selectTabGroups)

    this.state = {
      data,
      shouldShowExclude,
      shouldShowInfo: false,
      shouldShowNote,
      shouldBoxGroup,
      shouldTabGroup
    }
  }

  componentDidUpdate() {
    this.saveData()
  }

  onExcludeToggle = () => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    Object.assign(data, { exclude: !data.exclude })

    this.setState({ data })
  }

  onPressLearnMore = () => {
    this.setState({ shouldShowInfo: !this.state.shouldShowInfo })
  }

  onRemove = () => {
    this.saveData(true)
    this.props.onClose()
  }

  onSave = () => {
    this.saveData()
    this.props.onClose()
  }

  onSelectTab = (group, value) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    Object.assign(data, { [group.key]: value })

    this.setState({ data })
  }

  saveData = (shouldDeleteData) => {
    const { date, symptom } = this.props
    const { data } = this.state

    save[symptom](data, date, shouldDeleteData)
  }

  render() {
    const { symptom, onClose } = this.props
    const { data,
      shouldShowExclude,
      shouldShowInfo,
      shouldTabGroup
    } = this.state
    const iconName = shouldShowInfo ? "chevron-down" : "chevron-up"

    return (
      <AppModal onClose={onClose}>
        <ScrollView
          style={styles.modalWindow}
          contentContainerStyle={styles.modalContainer}
        >
          {shouldTabGroup && symtomPage[symptom].selectTabGroups.map(group => {
            return (
              <Segment key={group.key}>
                <AppText style={styles.title}>{group.title}</AppText>
                <SelectTabGroup
                  activeButton={data[group.key]}
                  buttons={group.options}
                  onSelect={value => this.onSelectTab(group, value)}
                />
              </Segment>
            )
          })
          }
          {shouldShowExclude &&
            <Segment>
              <AppSwitch
                onToggle={this.onExcludeToggle}
                text={symtomPage[symptom].excludeText}
                value={data.exclude}
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