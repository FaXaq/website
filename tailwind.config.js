module.exports = {
  prefix: '',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  content: [
    './app/**/*.tsx',
    './styles/*.scss'
  ],
  purge: false,
  variants: {},
  plugins: [],
  safelist: [
    {
      pattern: /grid-(cols|rows)-.*/
    }
  ],
  theme: {
    extend: {
      fontFamily: {
        'mtts-title': ['Nunito', 'Open Sans', 'sans'],
        'mtts-text': ['Open Sans', 'sans'],
        'corsica-title': ['Nunito', 'Open Sans', 'sans'],
        'corsica-text': ['Open Sans', 'sans']
      },
      colors: {
        'light-marine': '#3BA0B8',
        'dark-marine': '#173E57',
        'light-sand': '#F5E5C7',
        'dark-sand': '#AB9280',
        'mtts-dark-violet': '#332640',
        'mtts-dark-violet-200': '#594370',
        'mtts-light-violet': '#997FB3',
        'mtts-cta-0': '#D237C6',
        'mtts-cta-1': '#DB61D2',
        'mtts-cta-2': '#E58CDE',
        'mtts-cta-3': '#EEB4EA',
        'mtts-cta-4': '#F7DEF5',
        'mtts-white': '#FAF9FB',
        'mtts-yellow': '#E1BC29',
        'mtts-khaki': '#8EB74E',
        'mtts-green': '#3BB273',
        'mtts-blue': '#598D91',
        'mtts-violet': '#7768AE',
        'mtts-red': '#E15554',
        'mtts-success': '#8CE6AA',
        'mtts-error': '#D65C5C',
        'corsica-gray': '#5a647c',
        'corsica-blue': '#7FA9EF',
        'corsica-clay': '#c2b09c',
        'corsica-brown': '#ac8259',
        'corsica-green': '#51D43C',
        'corsica-khaki': '#726949',
        'corsica-olive': '#3c412a',
        'corsica-white': '#EFEBEB',
        'corsica-red': '#DE3B3B'
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
        '10xl': '8rem'
      },
      margin: {
        '1/2': '50%',
      },
      flexGrow: {
        0: 0,
        1: 1,
        2: 2
      },
      height: {
        'icon-s': '2rem',
        'icon-m': '4rem',
        'icon-l': '8rem',
        'icon-xl': '16rem',
        'icon-xxl': '32rem',
        72: '18rem',
        80: '20rem',
        96: '24rem'
      },
      translate: {
        '3/2': '150%'
      },
      width: {
        'icon-s': '2rem',
        'icon-m': '4rem',
        'icon-l': '8rem',
        'icon-xl': '16rem',
        'icon-xxl': '32rem',
        72: '18rem',
        80: '20rem',
        96: '24rem'
      },
      maxWidth: {
        '1/2': '50%'
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))',
        '26': 'repeat(26, minmax(0, 1fr))',
        '27': 'repeat(27, minmax(0, 1fr))',
        '28': 'repeat(28, minmax(0, 1fr))',
        '29': 'repeat(29, minmax(0, 1fr))',
        '30': 'repeat(30, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))',
        '26': 'repeat(26, minmax(0, 1fr))',
        '27': 'repeat(27, minmax(0, 1fr))',
        '28': 'repeat(28, minmax(0, 1fr))',
        '29': 'repeat(29, minmax(0, 1fr))',
        '30': 'repeat(30, minmax(0, 1fr))'
      },
    }
  }
}
