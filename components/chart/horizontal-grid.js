import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import { getTickPositions } from '../helpers/chart'

import { Colors } from '../../styles/redesign'
import { GRID_LINE_HORIZONTAL_WIDTH, YAXIS_WIDTH } from '../../config'

const HorizontalGrid = ({ height }) => {
  return getTickPositions(height).map(tick => {
    return (
      <View key={tick} top={tick} {...styles.line}/>
    )
  })
}

HorizontalGrid.propTypes = {
  height: PropTypes.number
}

const styles = StyleSheet.create({
  line: {
    borderStyle: 'solid',
    borderBottomColor: Colors.grey,
    borderBottomWidth: GRID_LINE_HORIZONTAL_WIDTH,
    left: YAXIS_WIDTH,
    position:'absolute',
    right: 0
  }
})

export default HorizontalGrid
