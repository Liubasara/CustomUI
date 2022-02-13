<!-- 为基础 submenu 添加基于 body 的 transform 二级菜单展示功能 -->
<template>
  <li
    :class="classname"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <slot name="icon" />
    <span class="v-contextmenu-submenu__title">
      <slot name="title">{{ title }}</slot>

      <span class="v-contextmenu-iconfont v-contextmenu-submenu__icon" />
    </span>

    <template v-if="!useTransform">
      <ul
        v-show="hover"
        ref="submenu"
        :class="submenuCls"
      >
        <slot />
      </ul>
    </template>
  </li>
</template>

<script>
import Vue from 'vue';
import { ZIndexManager } from '../utils'

export default {
  name: 'VContextmenuSubmenuTransform',

  inject: ['$$contextmenu'],

  props: {
    title: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    useTransform: {
      type: Boolean,
      default: true
    },
    delayTime: {
      // useTransform 模式下鼠标离开一级菜单（hover）后允许消失的延时（用于等待将鼠标移到二级菜单上）
      // 通常在 transformOffset.left || transformOffset.right 不为 0 的情况下使用
      type: Number,
      default: 100
    },
    transformOffset: {
      // transform 位置微调
      type: Object,
      default: () => ({
        top: 0,
        right: 0,
        left: -0,
        bottom: 0
      })
    },
    transformClass: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      hover: false,
      submenuPlacement: [],
      transformSubMenu: null,
      transformMenuVisible: true,
      transformSubmenuHover: false,
      transformStyle: {
        transform: 'unset',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: ZIndexManager.nextZIndex()
      },
      targetDimension: null
    };
  },
  computed: {
    classname() {
      return {
        'v-contextmenu-item': true,
        'v-contextmenu-submenu': true,
        'v-contextmenu-item--hover': this.hover || this.transformSubmenuHover,
        'v-contextmenu-item--disabled': this.disabled
      };
    },
    submenuCls() {
      return ['v-contextmenu', `v-contextmenu--${this.$$contextmenu.theme}`, ...this.submenuPlacement];
    },
    _transformMenuVisible() {
      return (
        this.transformMenuVisible && (this.hover || this.transformSubmenuHover)
      );
    }
  },
  watch: {
    '$$contextmenu.visible': function (val) {
      if (this.useTransform) {
        this.transformMenuVisible = val;
      }
    }
  },

  mounted() {
    this.useTransform && this.addSubMenuRef();
  },
  beforeDestroy() {
    this.useTransform && this.removeSubMenuRef();
  },
  beforeUpdate() {
    this.useTransform && this.transformSubMenu && this.transformSubMenu.$forceUpdate && this.transformSubMenu.$forceUpdate();
  },

  methods: {
    getSubmenuPlacement(
      targetDimension,
      { submenuWidth = 0, submenuHeight = 0 } = {}
    ) {
      const submenuPlacement = [];

      if (targetDimension.right + submenuWidth >= window.innerWidth) {
        submenuPlacement.push('left');
      } else {
        submenuPlacement.push('right');
      }

      if (targetDimension.top + submenuHeight >= window.innerHeight) {
        submenuPlacement.push('top');
      } else {
        submenuPlacement.push('bottom');
      }
      return submenuPlacement;
    },
    handleMouseenter(event) {
      if (this.disabled) return;

      const { target } = event;
      const targetDimension = target.getBoundingClientRect();
      this.targetDimension = targetDimension;
      this.hover = true;

      this.$emit('mouseenter', this, event);

      if (this.useTransform) {
        this.positionTransformSubMenu(targetDimension);
        return;
      }

      this.$nextTick(() => {
        const submenuWidth = this.$refs.submenu.clientWidth;
        const submenuHeight = this.$refs.submenu.clientHeight;
        const submenuPlacement = this.getSubmenuPlacement(targetDimension, {
          submenuWidth,
          submenuHeight
        });
        this.submenuPlacement = submenuPlacement;
      });
    },
    handleMouseleave(event) {
      if (this.disabled) return;
      this.targetDimension = null;
      const leave = () => {
        this.hover = false;
      };
      if (this.useTransform) {
        setTimeout(() => {
          leave();
        }, this.delayTime);
      } else {
        leave();
      }
      this.$emit('mouseleave', this, event);
    },
    /**
     * when use Transform Start
     */
    addSubMenuRef() {
      const self = this;
      const SubMenuConstr = Vue.extend({
        name: 'VContextmenuSubmenuTransformInstance',
        render(h) {
          const _this = this
          return h(
            'ul',
            {
              on: {
                mouseenter(event) {
                  _this.$emit('transformMouseEnter', self, event);
                },
                mouseleave(event) {
                  _this.$emit('transformMouseLeave', self, event);
                }
              },
              class: [
                ...self.submenuCls,
                'v-contextmenu-submenu',
                self.transformClass
              ],
              style: [
                {
                  display: self._transformMenuVisible ? '' : 'none'
                },
                self.transformStyle
              ]
            },
            [self.$slots.default]
          )
        },
        provide() {
          return {
            $$contextmenu: self.$$contextmenu,
            $$transformSubmenu: this,
            $$submenu: self
          };
        }
      });
      const instance = new SubMenuConstr({
        parent: this
      });
      this.transformSubMenu = instance.$mount();
      document.body.appendChild(this.transformSubMenu.$el);
      this.$$contextmenu.submenuTransformReferences.push(this.transformSubMenu)
      this.transformSubMenu.$on('transformMouseEnter', function (...args) {
        this.$parent.$emit('transformMouseEnter', ...args)
      })
      this.transformSubMenu.$on('transformMouseLeave', function (...args) {
        this.$parent.$emit('transformMouseLeave', ...args)
      })
      self.$on('transformMouseEnter', function (...args) {
        this.transformSubmenuHover = true
        this.$parent.$emit('transformMouseEnter', ...args)
      })
      self.$on('transformMouseLeave', function (...args) {
        this.transformSubmenuHover = false
        this.$parent.$emit('transformMouseLeave', ...args)
      })
    },
    removeSubMenuRef() {
      if (this.transformSubMenu) {
        this.$$contextmenu.submenuTransformReferences = this.$$contextmenu.submenuTransformReferences.filter(
          item => item !== this.transformSubMenu
        )
        this.transformSubMenu.destroy && this.transformSubMenu.destroy()
        document.body.removeChild(this.transformSubMenu.$el)
      }
    },
    positionTransformSubMenu(_targetDimension) {
      const targetDimension = _targetDimension || this.targetDimension;
      if (!targetDimension) return;
      this.$nextTick(() => {
        const submenuWidth = this.transformSubMenu.$el.clientWidth;
        const submenuHeight = this.transformSubMenu.$el.clientHeight;
        const submenuPlacement = this.getSubmenuPlacement(targetDimension, {
          submenuWidth,
          submenuHeight
        });
        this.submenuPlacement = submenuPlacement;

        const { top = 0, bottom = 0, left = 0, right = 0 } =
          this.transformOffset || {};
        let translateX = '0px';
        let translateY = '0px';
        ~submenuPlacement.indexOf('top') &&
          (translateY = `${targetDimension.y + targetDimension.height - submenuHeight + top
            }px`);
        ~submenuPlacement.indexOf('bottom') &&
          (translateY = `${targetDimension.y + bottom}px`);
        ~submenuPlacement.indexOf('left') &&
          (translateX = `${targetDimension.x - submenuWidth + left}px`);
        ~submenuPlacement.indexOf('right') &&
          (translateX = `${targetDimension.x + targetDimension.width + right
            }px`);
        this.$set(
          this.transformStyle,
          'transform',
          `translate(${translateX}, ${translateY})`
        );
      });
    }
    /**
     * when use Transform End
     */
  }
};
</script>
