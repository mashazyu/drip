import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import AppPage from '../common/app-page'
import SymptomBox from './SymptomBox'
import SymptomPageTitle from './symptom-page-title'

import { connect } from 'react-redux'
import { getDate, setDate } from '../../slices/date'
import { navigate } from '../../slices/navigation'

import cycleModule from '../../lib/cycle'
import { getData, isDateInFuture } from '../helpers/cycle-day'
import { dateToTitle } from '../helpers/format-date'
import { getCycleDay } from '../../db'

import { general as labels} from '../../i18n/en/cycle-day'
import { Spacing } from '../../styles/redesign'

class CycleDayOverView extends Component {

  static propTypes = {
    navigate: PropTypes.func,
    setDate: PropTypes.func,
    cycleDay: PropTypes.object,
    date: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = { cycleDay: getCycleDay(props.date) }
  }

  updateCycleDay = (date) => {
    this.props.setDate(date)
    this.setState({ cycleDay: getCycleDay(date) })
  }

  render() {
    const { cycleDay } = this.state
    const { date } = this.props

    const symptomBoxesList = [
      'bleeding',
      'temperature',
      'mucus',
      'cervix',
      'desire',
      'sex',
      'pain',
      'mood',
      'note',
    ]

    const { getCycleDayNumber } = cycleModule()
    const cycleDayNumber = getCycleDayNumber(date)
    const subtitle = cycleDayNumber && `${labels.cycleDayNumber}${cycleDayNumber}`

    return (
      <AppPage>
        <SymptomPageTitle
          getSymptomDataForDay={this.updateCycleDay}
          subtitle={subtitle}
          title={dateToTitle(date)}
        />
        <View style={styles.container}>
          {symptomBoxesList.map(symptom => {
            const symptomEditView =
              `${symptom[0].toUpperCase() + symptom.substring(1)}EditView`
            const data = cycleDay && cycleDay[symptom]
              ? cycleDay[symptom] : null
            const symptomDataToDisplay = getData(symptom, data)
            const excluded = data !== null ? data.exclude : false

            return(
              <SymptomBox
                disabled={isDateInFuture(date)}
                excluded={excluded}
                key={symptom}
                onPress={() => this.props.navigate(symptomEditView)}
                symptom={symptom}
                symptomData={symptomDataToDisplay}
              />)
          })
          }
        </View>
      </AppPage>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: Spacing.base
  }
})

const mapStateToProps = (state) => {
  return({
    date: getDate(state),
  })
}

const mapDispatchToProps = (dispatch) => {
  return({
    setDate: (date) => dispatch(setDate(date)),
    navigate: (page) => dispatch(navigate(page)),
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CycleDayOverView)
