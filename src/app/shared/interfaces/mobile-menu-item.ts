export interface MobileMenuItemBase {
    label: string;
    data?: any;
    children?: MobileMenuItem[];
}

export interface MobileMenuItemLink extends MobileMenuItemBase {
    type: 'link';
    url: string;
    code?: string;
    params?: any;
}

export interface MobileMenuItemButton extends MobileMenuItemBase {
    type: 'button';
    code?: string;
}

export type MobileMenuItem = MobileMenuItemLink | MobileMenuItemButton;
