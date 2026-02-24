import { MobileMenuItem } from '../app/shared/interfaces/mobile-menu-item';

export const mobileMenu: MobileMenuItem[] = [
    {type: 'link', label: 'mobileMenu.Home', url: '/'},

    {type: 'link', label: 'mobileMenu.Categories', url: '/shop/catalog' , code:'catalog'},

    {type: 'link', label: 'mobileMenu.Shop', url: '/shop/catalog', code:'shop', children: [
        {type: 'link', label: 'mobileMenu.ShopList',          url: '/shop/catalog'},
        {type: 'link', label: 'mobileMenu.Cart',        url: '/shop/cart'}
    ]},

    {type: 'link', label: 'mobileMenu.Account', url: '/account', children: [
        {type: 'link', label: 'mobileMenu.Login',           url: '/account/login'},
        {type: 'link', label: 'mobileMenu.Dashboard',       url: '/account/dashboard'},
        {type: 'link', label: 'mobileMenu.EditProfile',    url: '/account/profile'},
        {type: 'link', label: 'mobileMenu.OrderHistory',   url: '/account/orders'},
        {type: 'link', label: 'mobileMenu.AddressBook',    url: '/account/addresses'},
        {type: 'link', label: 'mobileMenu.ChangePassword', url: '/account/password'}
    ]},
    {type: 'link', label: 'mobileMenu.Pages', url: '/site', children: [
        {type: 'link', label: 'mobileMenu.AboutUs',             url: '/site/about-us'},
        {type: 'link', label: 'mobileMenu.ContactUs',           url: '/site/contact-us'},
        {type: 'link', label: 'mobileMenu.TermsAndConditions', url: '/site/terms'}
    ]},

    {type: 'button', label: 'mobileMenu.Currency', children: [
        {type: 'button', label: '€ mobileMenu.Euro',           data: {currency: 'EUR'}}
    ]},

    {type: 'button', label: 'mobileMenu.Language', children: [
        {type: 'button', label: 'mobileMenu.English', data: {language: 'en'}},
        {type: 'button', label: 'mobileMenu.French',  data: {language: 'fr'}},
        {type: 'button', label: 'mobileMenu.Chinois',  data: {language: 'cn'}}
    ]}
];
