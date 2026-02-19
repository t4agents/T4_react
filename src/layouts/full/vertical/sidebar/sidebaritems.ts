export interface ChildItem {
    id?: number | string;
    name?: string;
    icon?: string;
    children?: ChildItem[];
    item?: unknown;
    url?: string;
    color?: string;
    disabled?: boolean;
    subtitle?: string;
    badge?: boolean;
    badgeType?: string;
    isPro?: boolean;
}

export interface MenuItem {
    heading?: string;
    name?: string;
    icon?: string;
    id?: number;
    to?: string;
    items?: MenuItem[];
    children?: ChildItem[];
    url?: string;
    disabled?: boolean;
    subtitle?: string;
    badgeType?: string;
    badge?: boolean;
    isPro?: boolean;
}

import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
    // ==================== NON-PRO SECTIONS ====================
    {
        heading: 'Home',
        children: [
            {
                name: 'Dashboard',
                icon: 'solar:widget-2-linear',
                id: uniqueId(),
                url: '/',
                isPro: false,
            },
        ],
    },


    
    {
        heading: 'payroll',
        children: [
            {
                name: 'Run Payroll',
                icon: 'solar:play-circle-linear',
                id: uniqueId(),
                url: '/apps/payroll',
            },
            {
                name: 'Schedules',
                icon: 'solar:calendar-linear',
                id: uniqueId(),
                url: '/payroll/schedule',
            },

            {
                name: 'Periods ',
                icon: 'solar:calendar-search-linear',
                id: uniqueId(),
                url: '/payroll/periods',
            },
            {
                name: 'Employees',
                icon: 'solar:users-group-rounded-linear',
                id: uniqueId(),
                url: '/payroll/employee',
            },


        ],
    },
    // {
    //     heading: 'Apps',
    //     children: [
    //         {
    //             id: uniqueId(),
    //             name: 'Notes',
    //             icon: 'solar:notes-linear',
    //             url: '/apps/notes',
    //             isPro: false,
    //         },
    //         {
    //             id: uniqueId(),
    //             name: 'Tickets',
    //             icon: 'solar:ticker-star-linear',
    //             url: '/apps/tickets',
    //             isPro: false,
    //         },
    //         {
    //             name: 'Blogs',
    //             id: uniqueId(),
    //             icon: 'solar:sort-by-alphabet-linear',
    //             children: [
    //                 {
    //                     id: uniqueId(),
    //                     name: 'Blog Post',
    //                     url: '/apps/blog/post',
    //                     isPro: false,
    //                 },
    //                 {
    //                     id: uniqueId(),
    //                     name: 'Blog Detail',
    //                     url: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
    //                     isPro: false,
    //                 },
    //             ],
    //         },
    //     ],
    // },
    {
        heading: 'settings',
        children: [
            {
                id: uniqueId(),
                name: 'User Profile',
                icon: 'solar:user-circle-linear',
                url: '/user-profile',
                isPro: false,
            },
            {
                id: uniqueId(),
                name: 'Clients',
                icon: 'solar:buildings-2-linear',
                url: '/clients',
                isPro: false,
            },
        ],
    },
];

export default SidebarContent;
