import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: require('@/components/Stock').default
    },
    {
      path: '/sales',
      name: 'sales-page',
      component: require('@/components/SalesEntry/sales').default
    },
    {
      path: '/purchase',
      name: 'purchase-page',
      component: require('@/components/PurchaseEntry/purchase').default
    },
    {
      path: '/creditNote',
      name: 'credit',
      component: require('@/components/Note/CreditNote').default
    },
    {
      path: '/debitNote',
      name: 'debit',
      component: require('@/components/Note/DebitNote/').default
    },
    {
      path: '/party',
      name: 'party',
      component: require('@/components/Party').default
    },
    {
      path: '/delivery',
      name: 'delivery-page',
      component: require('@/components/DeliveryChallan').default
    },
    {
      path: '/report',
      name: 'report-page',
      component: require('@/components/Report').default
    },
    {
      path: '/print',
      name: 'print',
      component: require('@/components/Print').default
    },
    {
      path: '/editSales',
      name: 'edit-sales',
      component: require('@/components/EditEntry/Sales').default
    },
    {
      path: '/editPurchase',
      name: 'edit-purchase',
      component: require('@/components/EditEntry/Purchase').default
    },
    {
      path: '/editStock',
      name: 'edit-stock',
      component: require('@/components/EditEntry/Stock').default
    },
     {
       path: '/editcreditnote',
       name: 'edit-credit-note',
       component: require('@/components/EditEntry/Credit').default
     },
     {
       path: '/editdebitnote',
       name: 'edit-debit-note',
       component: require('@/components/EditEntry/Debit').default
     },
     {
       path: '/editdelivery',
       name: 'edit-delivery',
       component: require('@/components/EditEntry/Delivery').default
     }
  ]
});
