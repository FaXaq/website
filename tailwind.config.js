module.exports = {
  prefix: '',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  purge: false,
  variants: {},
  plugins: [],
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
        'corsica-blue': '#89a4d1',
        'corsica-clay': '#c2b09c',
        'corsica-brown': '#ac8259',
        'corsica-green': '#7e8d4f',
        'corsica-khaki': '#726949',
        'corsica-olive': '#3c412a',
        'corsica-white': '#E8E6E3',
        'corsica-red': '#944747'
      },
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
        '10xl': '8rem'
      },
      flexGrow: {
        0: 0,
        1: 1,
        2: 2
      },
      height: {
        '1/2': '50%',
        'icon-s': '2rem',
        'icon-m': '4rem',
        'icon-l': '8rem',
        'icon-xl': '16rem',
        'icon-xxl': '32rem',
        72: '18rem',
        80: '20rem',
        96: '24rem'
      },
      width: {
        '1/2': '50%',
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
      }
    }
  }
}
