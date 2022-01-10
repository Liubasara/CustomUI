import JSTemplate from '@custom-lb-ui/v-contextmenu-transform/src/index'
import { actions } from '@storybook/addon-actions'

// import JSTemplate from '@custom-lb-ui/v-contextmenu-transform'
// import '@custom-lb-ui/v-contextmenu-transform/dist/style.css'

export default {
  title: 'JSTemplate',
  component: JSTemplate,
  argTypes: {}
}

const Template = (args, { argTypes }) => {
  return {
    props: Object.keys(argTypes),
    // Components used in your story `template` are defined in the `components` object
    components: { JSTemplate },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      // Story args can be spread into the returned object
      return { ...args };
    },
    methods: {
      getListeners() {
        const allEmitEvents = Object.keys(argTypes).filter(
          (propKey) => argTypes?.[propKey]?.table?.category === 'events'
        )
        return {
          ...actions(...allEmitEvents)
        }
      }
    },
    // Then, the spread values can be accessed directly in the template
    template: '<JSTemplate v-bind="$props" v-on="getListeners()" />'
  }
}

export const Primary = Template.bind({})
Primary.args = {}
