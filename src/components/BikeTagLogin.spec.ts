import { mount } from '@cypress/vue'
import BikeTagLogin from './BikeTagLogin.vue'

it('Passes msg prop correctly', () => {
  mount(BikeTagLogin, {
    propsData: {
      msg: 'Hello World',
    },
  })

  cy.get('h2').should('contain.text', 'Hello World')
})
