import JSTemplate from '@custom-liubasara-ui/common-search-input'
import '@custom-liubasara-ui/common-search-input/dist/style.css'

export default {
  title: 'JSTemplate',
  component: JSTemplate,
  argTypes: {},
};

const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { JSTemplate },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    // Story args can be spread into the returned object
    return { ...args };
  },
  // Then, the spread values can be accessed directly in the template
  template: '<JSTemplate />',
});

export const Primary = Template.bind({});
Primary.args = {
  // user: {},
};