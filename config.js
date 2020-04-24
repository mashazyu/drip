const config = {
  columnWidth: 25,
  xAxisHeightPercentage: 0.08,
  xAxisHeightPercentageLarge: 0.12,
  symptomHeightPercentage: 0.05,
  symptomHeightPercentageLarge: 0.1,
  temperatureScale: {
    defaultLow: 35,
    defaultHigh: 38,
    min: 34,
    max: 40,
    step: 0.5,
    units: 0.1,
    verticalPadding: 0.03
  },
  symptoms: [
    'bleeding',
    'mucus',
    'cervix',
    'sex',
    'desire',
    'pain',
    'mood',
    'note'
  ],
}

config.columnMiddle = config.columnWidth / 2

export const ACTION_DELETE = 'delete'
export const ACTION_EXPORT = 'export'
export const ACTION_IMPORT = 'import'

export default config