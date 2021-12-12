import TSTemplate from '@custom-liubasara-ui/frame-select'
import '@custom-liubasara-ui/frame-select/dist/style.css'

export default {
  title: 'TSTemplate',
  component: TSTemplate,
  argTypes: {},
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { TSTemplate },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    // Story args can be spread into the returned object
    return { ...args };
  },
  // Then, the spread values can be accessed directly in the template
  template: '<TSTemplate />',
});

export const Primary = Template.bind({});
Primary.args = {
  // user: {},
};