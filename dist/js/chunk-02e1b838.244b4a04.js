(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-02e1b838"],{"13b3":function(t,e,i){},"21bb":function(t,e,i){"use strict";var s=i("d63f"),n=i.n(s);n.a},"63b7":function(t,e,i){},bb51:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("v-container",[i("v-container",[i("v-img",{attrs:{src:"/img/delebritex.jpeg","max-height":"50%","max-width":"auto%",contain:"",position:""}})],1)],1),i("v-spacer"),i("v-card",{staticClass:"spaceCard",attrs:{dark:""}},[i("v-toolbar",{attrs:{flat:""}},[i("v-toolbar-title",{staticClass:"center"},[t._v("Nuestros productos")])],1)],1),i("v-carousel",{staticClass:"space"},t._l(t.limitProduct(),(function(t,e){return i("v-carousel-item",{key:e,attrs:{src:t.imagen,"reverse-transition":"fade-transition",transition:"fade-transition",to:"/catalogo","show-arrows-on-hover":"",cycle:""}})})),1)],1)},n=[],r=i("5530"),o=i("2f62"),a={data:function(){return{length:3,onboarding:0,producto:"",productoId:"",colors:["indigo","warning","pink darken-2","red lighten-1","deep-purple accent-4"],slides:["First","Second","Third","Fourth","Fifth"],array:[]}},beforeMount:function(){this.getProducts(),this.limitProduct()},computed:Object(r["a"])({},Object(o["d"])({productos:function(t){return t.productos.productos},carrito:function(t){return t.carritos.carrito}})),methods:Object(r["a"])({},Object(o["b"])({getProducts:"productos/getProducts",addToCart:"carrito/addToCart",removeFromCart:"carrito/removeFromCart",findProduct:"productos/findProduct"}),{changePaginate:function(){return window.screen.width>=420?5:3},limitProduct:function(){for(var t=this.productos.length-5,e=[],i=t;i<this.productos.length;i++){var s=this.productos[i];e.push(s)}return e}})},h=a,l=(i("21bb"),i("2877")),c=i("6544"),d=i.n(c),u=i("7496"),v=i("b0af"),p=(i("63b7"),i("13b3"),i("c3f0")),m=i("afdd"),g=i("9d26"),w=i("604c"),f=w["a"].extend({name:"v-window",provide(){return{windowGroup:this}},directives:{Touch:p["a"]},props:{activeClass:{type:String,default:"v-window-item--active"},continuous:Boolean,mandatory:{type:Boolean,default:!0},nextIcon:{type:[Boolean,String],default:"$next"},prevIcon:{type:[Boolean,String],default:"$prev"},reverse:{type:Boolean,default:void 0},showArrows:Boolean,showArrowsOnHover:Boolean,touch:Object,touchless:Boolean,value:{required:!1},vertical:Boolean},data(){return{changedByDelimiters:!1,internalHeight:void 0,transitionHeight:void 0,transitionCount:0,isBooted:!1,isReverse:!1}},computed:{isActive(){return this.transitionCount>0},classes(){return{...w["a"].options.computed.classes.call(this),"v-window--show-arrows-on-hover":this.showArrowsOnHover}},computedTransition(){if(!this.isBooted)return"";const t=this.vertical?"y":"x",e=this.$vuetify.rtl&&"x"===t?!this.internalReverse:this.internalReverse,i=e?"-reverse":"";return`v-window-${t}${i}-transition`},hasActiveItems(){return Boolean(this.items.find(t=>!t.disabled))},hasNext(){return this.continuous||this.internalIndex<this.items.length-1},hasPrev(){return this.continuous||this.internalIndex>0},internalIndex(){return this.items.findIndex((t,e)=>this.internalValue===this.getValue(t,e))},internalReverse(){return this.reverse?!this.isReverse:this.isReverse}},watch:{internalIndex:"updateReverse"},mounted(){window.requestAnimationFrame(()=>this.isBooted=!0)},methods:{genContainer(){const t=[this.$slots.default];return this.showArrows&&t.push(this.genControlIcons()),this.$createElement("div",{staticClass:"v-window__container",class:{"v-window__container--is-active":this.isActive},style:{height:this.internalHeight||this.transitionHeight}},t)},genIcon(t,e,i){return this.$createElement("div",{staticClass:"v-window__"+t},[this.$createElement(m["a"],{props:{icon:!0},attrs:{"aria-label":this.$vuetify.lang.t("$vuetify.carousel."+t)},on:{click:()=>{this.changedByDelimiters=!0,i()}}},[this.$createElement(g["a"],{props:{large:!0}},e)])])},genControlIcons(){const t=[],e=this.$vuetify.rtl?this.nextIcon:this.prevIcon;if(this.hasPrev&&e&&"string"===typeof e){const i=this.genIcon("prev",e,this.prev);i&&t.push(i)}const i=this.$vuetify.rtl?this.prevIcon:this.nextIcon;if(this.hasNext&&i&&"string"===typeof i){const e=this.genIcon("next",i,this.next);e&&t.push(e)}return t},getNextIndex(t){const e=(t+1)%this.items.length,i=this.items[e];return i.disabled?this.getNextIndex(e):e},getPrevIndex(t){const e=(t+this.items.length-1)%this.items.length,i=this.items[e];return i.disabled?this.getPrevIndex(e):e},next(){if(this.isReverse=this.$vuetify.rtl,!this.hasActiveItems||!this.hasNext)return;const t=this.getNextIndex(this.internalIndex),e=this.items[t];this.internalValue=this.getValue(e,t)},prev(){if(this.isReverse=!this.$vuetify.rtl,!this.hasActiveItems||!this.hasPrev)return;const t=this.getPrevIndex(this.internalIndex),e=this.items[t];this.internalValue=this.getValue(e,t)},updateReverse(t,e){this.changedByDelimiters?this.changedByDelimiters=!1:this.isReverse=t<e}},render(t){const e={staticClass:"v-window",class:this.classes,directives:[]};if(!this.touchless){const t=this.touch||{left:()=>{this.$vuetify.rtl?this.prev():this.next()},right:()=>{this.$vuetify.rtl?this.next():this.prev()},end:t=>{t.stopPropagation()},start:t=>{t.stopPropagation()}};e.directives.push({name:"touch",value:t})}return t("div",e,[this.genContainer()])}}),T=i("37c6"),b=w["a"].extend({name:"button-group",provide(){return{btnToggle:this}},computed:{classes(){return w["a"].options.computed.classes.call(this)}},methods:{genData:w["a"].options.methods.genData}}),y=i("80d2"),C=i("d9bd"),x=f.extend({name:"v-carousel",props:{continuous:{type:Boolean,default:!0},cycle:Boolean,delimiterIcon:{type:String,default:"$delimiter"},height:{type:[Number,String],default:500},hideDelimiters:Boolean,hideDelimiterBackground:Boolean,interval:{type:[Number,String],default:6e3,validator:t=>t>0},mandatory:{type:Boolean,default:!0},progress:Boolean,progressColor:String,showArrows:{type:Boolean,default:!0},verticalDelimiters:{type:String,default:void 0}},data(){return{internalHeight:this.height,slideTimeout:void 0}},computed:{classes(){return{...f.options.computed.classes.call(this),"v-carousel":!0,"v-carousel--hide-delimiter-background":this.hideDelimiterBackground,"v-carousel--vertical-delimiters":this.isVertical}},isDark(){return this.dark||!this.light},isVertical(){return null!=this.verticalDelimiters}},watch:{internalValue:"restartTimeout",interval:"restartTimeout",height(t,e){t!==e&&t&&(this.internalHeight=t)},cycle(t){t?this.restartTimeout():(clearTimeout(this.slideTimeout),this.slideTimeout=void 0)}},created(){this.$attrs.hasOwnProperty("hide-controls")&&Object(C["a"])("hide-controls",':show-arrows="false"',this)},mounted(){this.startTimeout()},methods:{genControlIcons(){return this.isVertical?null:f.options.methods.genControlIcons.call(this)},genDelimiters(){return this.$createElement("div",{staticClass:"v-carousel__controls",style:{left:"left"===this.verticalDelimiters&&this.isVertical?0:"auto",right:"right"===this.verticalDelimiters?0:"auto"}},[this.genItems()])},genItems(){const t=this.items.length,e=[];for(let i=0;i<t;i++){const s=this.$createElement(m["a"],{staticClass:"v-carousel__controls__item",attrs:{"aria-label":this.$vuetify.lang.t("$vuetify.carousel.ariaLabel.delimiter",i+1,t)},props:{icon:!0,small:!0,value:this.getValue(this.items[i],i)}},[this.$createElement(g["a"],{props:{size:18}},this.delimiterIcon)]);e.push(s)}return this.$createElement(b,{props:{value:this.internalValue,mandatory:this.mandatory},on:{change:t=>{this.internalValue=t}}},e)},genProgress(){return this.$createElement(T["a"],{staticClass:"v-carousel__progress",props:{color:this.progressColor,value:(this.internalIndex+1)/this.items.length*100}})},restartTimeout(){this.slideTimeout&&clearTimeout(this.slideTimeout),this.slideTimeout=void 0,window.requestAnimationFrame(this.startTimeout)},startTimeout(){this.cycle&&(this.slideTimeout=window.setTimeout(this.next,+this.interval>0?+this.interval:6e3))}},render(t){const e=f.options.render.call(this,t);return e.data.style=`height: ${Object(y["e"])(this.height)};`,this.hideDelimiters||e.children.push(this.genDelimiters()),(this.progress||this.progressColor)&&e.children.push(this.genProgress()),e}}),I=i("9d65"),$=i("4e82"),B=i("58df");const V=Object(B["a"])(I["a"],Object($["a"])("windowGroup","v-window-item","v-window"));var A=V.extend().extend().extend({name:"v-window-item",directives:{Touch:p["a"]},props:{disabled:Boolean,reverseTransition:{type:[Boolean,String],default:void 0},transition:{type:[Boolean,String],default:void 0},value:{required:!1}},data(){return{isActive:!1,inTransition:!1}},computed:{classes(){return this.groupClasses},computedTransition(){return this.windowGroup.internalReverse?"undefined"!==typeof this.reverseTransition?this.reverseTransition||"":this.windowGroup.computedTransition:"undefined"!==typeof this.transition?this.transition||"":this.windowGroup.computedTransition}},methods:{genDefaultSlot(){return this.$slots.default},genWindowItem(){return this.$createElement("div",{staticClass:"v-window-item",class:this.classes,directives:[{name:"show",value:this.isActive}],on:this.$listeners},this.genDefaultSlot())},onAfterTransition(){this.inTransition&&(this.inTransition=!1,this.windowGroup.transitionCount>0&&(this.windowGroup.transitionCount--,0===this.windowGroup.transitionCount&&(this.windowGroup.transitionHeight=void 0)))},onBeforeTransition(){this.inTransition||(this.inTransition=!0,0===this.windowGroup.transitionCount&&(this.windowGroup.transitionHeight=Object(y["e"])(this.windowGroup.$el.clientHeight)),this.windowGroup.transitionCount++)},onTransitionCancelled(){this.onAfterTransition()},onEnter(t){this.inTransition&&this.$nextTick(()=>{this.computedTransition&&this.inTransition&&(this.windowGroup.transitionHeight=Object(y["e"])(t.clientHeight))})}},render(t){return t("transition",{props:{name:this.computedTransition},on:{beforeEnter:this.onBeforeTransition,afterEnter:this.onAfterTransition,enterCancelled:this.onTransitionCancelled,beforeLeave:this.onBeforeTransition,afterLeave:this.onAfterTransition,leaveCancelled:this.onTransitionCancelled,enter:this.onEnter}},this.showLazyContent(()=>[this.genWindowItem()]))}}),D=i("adda"),P=i("1c87");const _=Object(B["a"])(A,P["a"]);var S=_.extend({name:"v-carousel-item",inheritAttrs:!1,methods:{genDefaultSlot(){return[this.$createElement(D["a"],{staticClass:"v-carousel__item",props:{...this.$attrs,height:this.windowGroup.internalHeight},on:this.$listeners,scopedSlots:{placeholder:this.$scopedSlots.placeholder}},Object(y["n"])(this))]},genWindowItem(){const{tag:t,data:e}=this.generateRouteLink();return e.staticClass="v-window-item",e.directives.push({name:"show",value:this.isActive}),this.$createElement(t,e,this.genDefaultSlot())}}}),E=i("a523"),O=i("2fa4"),j=i("71d9"),k=i("2a7f"),G=Object(l["a"])(h,s,n,!1,null,null,null);e["default"]=G.exports;d()(G,{VApp:u["a"],VCard:v["a"],VCarousel:x,VCarouselItem:S,VContainer:E["a"],VImg:D["a"],VSpacer:O["a"],VToolbar:j["a"],VToolbarTitle:k["a"]})},d63f:function(t,e,i){}}]);
//# sourceMappingURL=chunk-02e1b838.244b4a04.js.map