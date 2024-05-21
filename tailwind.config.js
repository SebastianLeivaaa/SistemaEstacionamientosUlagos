/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 0px 30px -8px #000',
      },
      colors: {
        //PARA AGREGAR COLORES PERSONALIZADOS
        'congress-blue': {
          '50': '#ebf9ff',
          '100': '#d1f2ff',
          '200': '#aeeaff',
          '300': '#76dfff',
          '400': '#35caff',
          '500': '#07a8ff',
          '600': '#0082ff',
          '700': '#0069ff',
          '800': '#0057d7',
          '900': '#00408a',
          '950': '#062f65',
        },
        'blue-ribbon': {
          '50': '#eef8ff',
          '100': '#d8eeff',
          '200': '#b9e0ff',
          '300': '#89cfff',
          '400': '#52b4ff',
          '500': '#2a91ff',
          '600': '#0d6efd',
          '700': '#0c5ae9',
          '800': '#1149bc',
          '900': '#144194',
          '950': '#11295a',
        },
        'indice':{//colores del indice (registro)
          '50': 'rgba(52, 143, 255, 1)',
          '100': 'rgba(25, 63, 143, 1)',
        },
        'customGreen': '#E0F5A5',//menu guardias
        white: {
          '50': '#ffffff',
          '100': '#efefef',
          '200': '#dcdcdc',
          '300': '#bdbdbd',
          '400': '#989898',
          '500': '#7c7c7c',
          '600': '#656565',
          '700': '#525252',
          '800': '#464646',
          '900': '#3d3d3d',
          '950': '#292929',
        },
        'hint-of-green': {
          '50': '#f2fbf2',
          '100': '#e0f8e0',
          '200': '#c3efc3',
          '300': '#93e295',
          '400': '#5dcc5f',
          '500': '#36b139',
          '600': '#28912b',
          '700': '#227324',
          '800': '#205b22',
          '900': '#1c4b1f',
          '950': '#0a290c',
        },  
        'bubbles': {
          '50': '#eefcfd',
          '100': '#e0f7fa',
          '200': '#b0e8f1',
          '300': '#79d7e7',
          '400': '#3bbbd5',
          '500': '#1f9fbb',
          '600': '#1d809d',
          '700': '#1e6880',
          '800': '#215669',
          '900': '#204859',
          '950': '#0f2f3d',
        },
      }
    },
  },
  plugins: [],
}

