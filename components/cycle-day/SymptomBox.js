import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableOpacity } from 'react-native'

import AppText from '../common/app-text'
import DripIcon from '../../assets/drip-icons'

import { Colors, Sizes, Spacing } from '../../styles/redesign'
import { headerTitles as symptomTitles } from '../../i18n/en/labels'

const SymptomBox = ({ disabled, excluded, onPress, symptom, symptomData }) => {
  const iconName = `drip-icon-${symptom}`
  const isSymptomDisabled = ( disabled && symptom !== 'note' ) ? true : false
  const iconColor = isSymptomDisabled ? Colors.greyLight : Colors.grey
  const symptomNameStyle = [
    styles.symptomName,
    (isSymptomDisabled && styles.symptomNameDisabled),
    (excluded && styles.symptomNameExcluded)
  ]
  const textStyle = [
    styles.text,
    (isSymptomDisabled && styles.textDisabled),
    (excluded && styles.textExcluded)
  ]

  return (
    <TouchableOpacity
      disabled={isSymptomDisabled}
      onPress={onPress}
      style={styles.container}
      testID={iconName}
    >
      <DripIcon
        color={iconColor}
        isActive={!isSymptomDisabled}
        size={40}
        name={iconName}
      />
      <View style={styles.textContainer}>
        <AppText style={symptomNameStyle}>
          {symptomTitles[symptom].toLowerCase()}
        </AppText>
        {symptomData && <AppText style={textStyle}>
          {symptomData}
        </AppText>
        }
      </View>
    </TouchableOpacity>
  )
}

SymptomBox.propTypes = {
  disabled: PropTypes.bool.isRequired,
  excluded: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  symptom: PropTypes.string.isRequired,
  symptomData: PropTypes.string
}

export default SymptomBox

const excluded = {
  textDecorationLine: 'line-through'
}

const hint = {
  fontSize: Sizes.small,
  fontStyle: 'italic',
  height: Sizes.small * 3,
  lineHeight: Sizes.small,
  marginTop: Sizes.tiny
}

const main = {
  fontSize: Sizes.base,
  height: Sizes.base * 2,
  lineHeight: Sizes.base,
  textAlignVertical: 'center'
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    flexDirection: 'row',
    height: 110,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.base,
    width: Spacing.symptomTileWidth
  },
  symptomName: {
    color: Colors.purple,
    ...main
  },
  symptomNameDisabled: {
    color: Colors.grey
  },
  symptomNameExcluded: {
    color: Colors.greyDark,
    ...excluded
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: Spacing.small,
    maxWidth: Spacing.textWidth
  },
  text: {
    ...hint
  },
  textDisabled: {
    color: Colors.greyLight
  },
  textExcluded: {
    color: Colors.grey,
    ...excluded
  }
})