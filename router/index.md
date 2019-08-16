```javascript
import Vue from 'vue'
import Router from 'vue-router'
import fileName from 'fileUrl'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
	routes: [
    {
    	path: '/fileName',
    	name: 'fileName',
    	component: fileName,
    	meta: {
    		title: 'fileName',
    		requireAuth: false
    	},
      children:[
        {
          path: '/fileChildren', 
          meta: { auth: false },
          component: resolve => require(['fileChildrenUrl'], resolve),
        },
        {
          path: 'fileChildren', 
          meta: { auth: false },
          component: resolve => require(['fileChildrenUrl'], resolve),
        }
      ]
    },
	]
})

```