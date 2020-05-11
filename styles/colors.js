const redColor = '#c3000d'
export const shadesOfRed = ['#e7999e', '#db666d', '#cf323d', '#c3000d'] // light to dark
const violetColor = '#6a7b98'
const shadesOfViolet = ['#e3e7ed', '#c8cfdc', '#acb8cb', '#91a0ba', '#7689a9', violetColor] // light to dark
const yellowColor = '#dbb40c'
const shadesOfYellow = ['#f0e19d', '#e9d26d', '#e2c33c', yellowColor] // light to dark
const magentaColor = '#6f2565'
const shadesOfMagenta = ['#a87ca2', '#8b5083', magentaColor] // light to dark
const pinkColor = '#9e346c'
const shadesOfPink = ['#c485a6', '#b15c89', pinkColor] // light to dark
const lightGreenColor = '#bccd67'
const orangeColor = '#bc6642'
const mintColor = '#6ca299'

export default {
  greyDark: '#A5A5A5',
  grey: '#D2D2D2',
  greyLight: '#F2F2F2',
  orange: '#F38337',
  purple: '#3A2671',
  purpleLight: '#5D4F8A',
  tourquiseDark: '#69CBC1',
  tourquise: '#CFECEA',
  tourquiseLight: '#E9F2ED',
  iconColors: {
    'bleeding': {
      color: redColor,
      shades: shadesOfRed,
    },
    'mucus': {
      color: violetColor,
      shades: shadesOfViolet,
    },
    'cervix': {
      color: yellowColor,
      shades: shadesOfYellow,
    },
    'sex': {
      color: magentaColor,
      shades: shadesOfMagenta,
    },
    'desire': {
      color: pinkColor,
      shades: shadesOfPink,
    },
    'pain': {
      color: lightGreenColor,
      shades: [lightGreenColor],
    },
    'mood': {
      color: orangeColor,
      shades: [orangeColor],
    },
    'note': {
      color: mintColor,
      shades: [mintColor],
    },
  },
}