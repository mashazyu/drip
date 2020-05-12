import { LocalDate } from 'js-joda'

import * as labels from '../../i18n/en/cycle-day'
const bleedingLabels = labels.bleeding.labels
const intensityLabels = labels.intensity
const sexLabels = labels.sex.categories
const contraceptiveLabels = labels.contraceptives.categories
const painLabels = labels.pain.categories
const moodLabels = labels.mood.categories

function isNumber(val) {
  return typeof val === 'number'
}

export const symtomPage = {
  bleeding: {
    title: labels.bleeding.heaviness.explainer,
    options: bleedingLabels,
    excludeText: labels.bleeding.exclude.explainer
  },
  desire: {
    title: labels.desire.explainer,
    options: intensityLabels
  }
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