import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet , View } from 'react-native'

import DripIcon from '../../assets/drip-icons'

import { Colors, Containers } from '../../styles/redesign'
import { YAXIS_WIDTH, ICON_SIZE } from '../../config'

const SymptomIcon = ({ symptom, height }) => {
  return (
    <View style={styles.container} width={YAXIS_WIDTH} height={height}>
      <DripIcon
        size={ICON_SIZE}
        name={`drip-icon-${symptom}`}
        color={Colors.iconColors[symptom].color}
      />
    </View>
  )
}

SymptomIcon.propTypes = {
  height: PropTypes.number,
  symptom: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    ...Containers.centerItems
  }
})

export default SymptomIcon
