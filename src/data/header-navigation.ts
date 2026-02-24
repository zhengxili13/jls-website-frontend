import { NavigationLink } from '../app/shared/interfaces/navigation-link';

export const navigation: NavigationLink[] = [
    {label: 'Header.links.Home', url: '/'},
    {label: 'Header.links.Shop', url: '/shop/catalog/power-tools', menu: {
        type: 'menu',
        items: [
            {label: 'Header.links.ShopList', url: '/shop/catalog'},
            {label: 'Header.links.Cart', url: '/shop/cart'},
            {label: 'Header.links.Wishlist', url: '/shop/wishlist'},
        ]
    }},
    {label: 'Header.links.Account', url: '/account', menu: {
        type: 'menu',
        items: [
            {label: 'Header.links.Login',           url: '/account/login'},
            {label: 'Header.links.Dashboard',       url: '/account/dashboard'},
            {label: 'Header.links.EditProfile',    url: '/account/profile'},
            {label: 'Header.links.OrderHistory',   url: '/account/orders'},
            {label: 'Header.links.AddressBook',    url: '/account/addresses'},
            {label: 'Header.links.EditAddress', url: '/account/address', params:{Type:'facturationAdress'}},
            {label: 'Header.links.ChangePassword', url: '/account/password'}
        ]
    }},
    {label: 'mobileMenu.Pages', url: '/site', menu: {
        type: 'menu',
        items: [
            {label: 'mobileMenu.AboutUs',             url: '/site/about-us'},
            {label: 'mobileMenu.ContactUs',           url: '/site/contact-us'},
            {label: 'mobileMenu.TermsAndConditions', url: '/site/terms'}
        ]
    }}
];
