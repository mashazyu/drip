import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import { Colors, Containers } from '../../styles/redesign'
import {
  COLUMN_WIDTH,
  DOT_RADIUS,
  GRID_LINE_HORIZONTAL_WIDTH
} from '../../config'

const SymptomCell = ({
  height,
  symptom,
  symptomValue,
  isSymptomDataComplete
}) => {

  const shouldDrawDot = symptomValue !== false
  const styleCell = [styles.cell, { height, width: COLUMN_WIDTH }]
  let styleDot

  if (shouldDrawDot) {
    const styleSymptom = Colors.iconColors[symptom]
    const symptomColor = styleSymptom.shades[symptomValue]
    const isMucusOrCervix = (symptom === 'mucus') || (symptom === 'cervix')
    const backgroundColor = (isMucusOrCervix && !isSymptomDataComplete) ?
      'white' : symptomColor
    const borderWidth = (isMucusOrCervix && !isSymptomDataComplete) ? 2 : 0
    const borderColor = symptomColor
    styleDot = [styles.dot, { backgroundColor, borderColor, borderWidth }]
  }

  return (
    <View style={styleCell} key={symptom}>
      {shouldDrawDot && <View style={styleDot} />}
    </View>
  )
}

SymptomCell.propTypes = {
  height: PropTypes.number,
  symptom: PropTypes.string,
  symptomValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  isSymptomDataComplete: PropTypes.bool,
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: 'white',
    borderColor: Colors.greyLight,
    borderWidth: GRID_LINE_HORIZONTAL_WIDTH,
    ...Containers.centerItems
  },
  dot: {
    width: DOT_RADIUS * 2,
    height: DOT_RADIUS * 2,
    borderRadius: 50
  }
})
export default SymptomCell
