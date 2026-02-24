export interface Link {
    label: string;
    url: string;
    action?: string;
    external?: boolean;
    target?: '_self'|'_blank';
    params?: any
}
