import { LocalDate } from 'js-joda'

import { saveSymptom } from '../../db'

import * as labels from '../../i18n/en/cycle-day'
import { getLabelsList } from './labels'

const bleedingLabels = labels.bleeding.labels
const intensityLabels = labels.intensity
const sexLabels = labels.sex.categories
const contraceptiveLabels = labels.contraceptives.categories
const painLabels = labels.pain.categories
const moodLabels = labels.mood.categories
const cervixLabels = labels.cervix
const mucusLabels = labels.mucus

const hasValueToSave = (value) => typeof value === 'number'
export const shouldShow = (value) => value !== null ? true : false

function isNumber(val) {
  return typeof val === 'number'
}

export const blank = {
  bleeding: {
    exclude: false,
    value: null
  },
  cervix: {
    exclude: false,
    firmness: null,
    opening: null,
    position: null,
  },
  desire: {
    value: null
  },
  mucus: {
    exclude: false,
    feeling: null,
    texture: null,
    value: null
  }
}

export const symtomPage = {
  bleeding: {
    excludeText: labels.bleeding.exclude.explainer,
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [{
      key: 'value',
      options: getLabelsList(bleedingLabels),
      title: labels.bleeding.heaviness.explainer,
    }]
  },
  cervix: {
    excludeText: cervixLabels.excludeExplainer,
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'opening',
        options: getLabelsList(cervixLabels.opening.categories),
        title: cervixLabels.opening.explainer,
      },
      {
        key: 'firmness',
        options: getLabelsList(cervixLabels.firmness.categories),
        title: cervixLabels.firmness.explainer,
      },
      {
        key: 'position',
        options: getLabelsList(cervixLabels.position.categories),
        title: cervixLabels.position.explainer,
      }
    ]
  },
  desire: {
    excludeText: null,
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [{
      key: 'value',
      options: getLabelsList(intensityLabels),
      title: labels.desire.explainer
    }]
  },
  mucus: {
    excludeText: mucusLabels.excludeExplainer,
    note: null,
    selectBoxGroups: null,
    selectTabGroups: [
      {
        key: 'feeling',
        options: getLabelsList(mucusLabels.feeling.categories),
        title: mucusLabels.feeling.explainer,
      },
      {
        key: 'texture',
        options: getLabelsList(mucusLabels.texture.categories),
        title: mucusLabels.texture.explainer,
      }
    ]
  },
}

export const save = {
  bleeding: (data, date, shouldDeleteData) => {
    const { exclude, value } = data
    const isDataEntered = hasValueToSave(value)
    const valuesToSave = shouldDeleteData || !isDataEntered
      ? null : { value, exclude }

    saveSymptom('bleeding', date, valuesToSave)
  },
  cervix: (data, date, shouldDeleteData) => {
    const { opening, firmness, position, exclude } = data
    const isDataEntered = ['opening', 'firmness', 'position'].some(
      value => hasValueToSave(data[value]))
    const valuesToSave = shouldDeleteData || !isDataEntered
      ? null : { opening, firmness, position, exclude }

    saveSymptom('cervix', date, valuesToSave)
  },
  desire: (data, date, shouldDeleteData) => {
    const { value } = data
    const valuesToSave = shouldDeleteData || !hasValueToSave(value)
      ? null : { value }

    saveSymptom('desire', date, valuesToSave)
  },
  mucus: (data, date, shouldDeleteData) => {
    const { feeling, texture, exclude } = data
    const isDataEntered = ['feeling', 'texture'].some(
      value => hasValueToSave(data[value]))
    const valuesToSave = shouldDeleteData || !isDataEntered
      ? null : { feeling, texture, exclude }

    saveSymptom('mucus', date, valuesToSave)
  },
}

const label = {
  bleeding: ({ value, exclude }) => {
    if (isNumber(value)) {
      const bleedingLabel = bleedingLabels[value]
      return exclude ? `(${bleedingLabel})` : bleedingLabel
    }
  },
  temperature: ({ value, time, exclude }) => {
    if (isNumber(value)) {
      let temperatureLabel = `${value} °C`
      if (time) {
        temperatureLabel += ` - ${time}`
      }
      if (exclude) {
        temperatureLabel = `(${temperatureLabel})`
      }
      return temperatureLabel
    }
  },
  mucus: mucus => {
    const filledCategories = ['feeling', 'texture'].filter(c => isNumber(mucus[c]))
    let label = filledCategories.map(category => {
      return labels.mucus.subcategories[category] + ': ' + labels.mucus[category].categories[mucus[category]]
    }).join(', ')

    if (isNumber(mucus.value)) label += `\n => ${labels.mucusNFP[mucus.value]}`
    if (mucus.exclude) label = `(${label})`

    return label
  },
  cervix: cervix => {
    const filledCategories = ['opening', 'firmness', 'position'].filter(c => isNumber(cervix[c]))
    let label = filledCategories.map(category => {
      return labels.cervix.subcategories[category] + ': ' + labels.cervix[category].categories[cervix[category]]
    }).join(', ')

    if (cervix.exclude) label = `(${label})`

    return label
  },
  note: note => note.value,
  desire: ({ value }) => {
    if (isNumber(value)) {
      return intensityLabels[value]
    }
  },
  sex: sex => {
    const sexLabel = []
    if (sex && Object.values({...sex}).some(val => val)){
      Object.keys(sex).forEach(key => {
        if(sex[key] && key !== 'other' && key !== 'note') {
          sexLabel.push(
            sexLabels[key] ||
            contraceptiveLabels[key]
          )
        }
        if(key === 'other' && sex.other) {
          let label = contraceptiveLabels[key]
          if(sex.note) {
            label = `${label} (${sex.note})`
          }
          sexLabel.push(label)
        }
      })
      return sexLabel.join(', ')
    }
  },
  pain: pain => {
    const painLabel = []
    if (pain && Object.values({...pain}).some(val => val)){
      Object.keys(pain).forEach(key => {
        if(pain[key] && key !== 'other' && key !== 'note') {
          painLabel.push(painLabels[key])
        }
        if(key === 'other' && pain.other) {
          let label = painLabels[key]
          if(pain.note) {
            label = `${label} (${pain.note})`
          }
          painLabel.push(label)
        }
      })
      return painLabel.join(', ')
    }
  },
  mood: mood => {
    const moodLabel = []
    if (mood && Object.values({...mood}).some(val => val)){
      Object.keys(mood).forEach(key => {
        if(mood[key] && key !== 'other' && key !== 'note') {
          moodLabel.push(moodLabels[key])
        }
        if(key === 'other' && mood.other) {
          let label = moodLabels[key]
          if(mood.note) {
            label = `${label} (${mood.note})`
          }
          moodLabel.push(label)
        }
      })
      return moodLabel.join(', ')
    }
  }
}

export const getData = (symptom, symptomData) => {
  return symptomData && label[symptom](symptomData)
}

export const prevDate = (dateString) => {
  return LocalDate.parse(dateString).minusDays(1).toString()
}

export const nextDate = (dateString) => {
  return LocalDate.parse(dateString).plusDays(1).toString()
}

export const isDateInFuture = (dateString) => {
  return LocalDate.now().isBefore(LocalDate.parse(dateString))
}

export const isTomorrowInFuture = (dateString) => {
  const tomorrow = nextDate(dateString)
  return LocalDate.now().isBefore(LocalDate.parse(tomorrow))
}

export const isYesterdayInFuture = (dateString) => {
  const yesterday = prevDate(dateString)
  return LocalDate.now().isBefore(LocalDate.parse(yesterday))
}