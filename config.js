const config = {
  temperatureScale: {
    defaultLow: 35,
    defaultHigh: 38,
    min: 34,
    max: 40,
    step: 0.5,
    units: 0.1
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

export const ACTION_DELETE = 'delete'
export const ACTION_EXPORT = 'export'
export const ACTION_IMPORT = 'import'

export const SYMPTOMS = [
  'bleeding',
  'mucus',
  'cervix',
  'sex',
  'desire',
  'pain',
  'mood',
  'note'
]

// chart configuration
export const COLUMN_WIDTH = 32
export const COLUMN_MIDDLE = COLUMN_WIDTH / 2
export const DOT_RADIUS = 6
export const GRID_LINE_HORIZONTAL_WIDTH = 0.3
export const ICON_SIZE = 20
export const STROKE_WIDTH = 3
export const XAXISHEIGHTRATIO = 0.14
export const SYMPTOMHEIGHTRATIO = 0.1
export const YAXIS_WIDTH = 32

export default config