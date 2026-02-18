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
    {
        heading: 'Apps',
        children: [
            {
                id: uniqueId(),
                name: 'Notes',
                icon: 'solar:notes-linear',
                url: '/apps/notes',
                isPro: false,
            },
            {
                id: uniqueId(),
                name: 'Tickets',
                icon: 'solar:ticker-star-linear',
                url: '/apps/tickets',
                isPro: false,
            },
            {
                name: 'Blogs',
                id: uniqueId(),
                icon: 'solar:sort-by-alphabet-linear',
                children: [
                    {
                        id: uniqueId(),
                        name: 'Blog Post',
                        url: '/apps/blog/post',
                        isPro: false,
                    },
                    {
                        id: uniqueId(),
                        name: 'Blog Detail',
                        url: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
                        isPro: false,
                    },
                ],
            },
        ],
    },
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
                name: 'Payroll',
                id: uniqueId(),
                icon: 'solar:card-linear',
                children: [
                    {
                        id: uniqueId(),
                        name: 'Payroll Scheduler',
                        url: '/settings/payroll_schedule',
                    },
                    {
                        id: uniqueId(),
                        name: 'Best Selling Product Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#bestsellingproduct',
                    },
                    {
                        id: uniqueId(),
                        name: 'Payment Gatways Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#paymentgateway',
                    },
                    {
                        id: uniqueId(),
                        name: 'Blog Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#blogcards',
                    },
                    {
                        id: uniqueId(),
                        name: 'Products Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#productscards',
                    },
                    {
                        id: uniqueId(),
                        name: 'Music Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#musiccards',
                    },
                    {
                        id: uniqueId(),
                        name: 'Profile Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#profilecards',
                    },
                    {
                        id: uniqueId(),
                        name: 'User Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#usercards',
                    },
                    {
                        id: uniqueId(),
                        name: 'Social Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#socialcards',
                    },
                    {
                        id: uniqueId(),
                        name: 'Settings Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#settingscard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Gift Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#giftcards',
                    },
                    {
                        id: uniqueId(),
                        name: 'Upcomming Activity Cards',
                        url: 'https://tailwind-admin.com/ui-blocks/card#upcommingactcard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Recent Transaction Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#recenttransactioncard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Recent Comment Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#recentcommentcard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Task List',
                        url: 'https://tailwind-admin.com/ui-blocks/card#tasklist',
                    },
                    {
                        id: uniqueId(),
                        name: 'Recent Messages',
                        url: 'https://tailwind-admin.com/ui-blocks/card#recentmessages',
                    },
                    {
                        id: uniqueId(),
                        name: 'User info Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#userinfocard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Social Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#socialcard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Feed Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#feedcard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Poll of Week Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#pollofweekcard',
                    },
                    {
                        id: uniqueId(),
                        name: 'Result of Poll',
                        url: 'https://tailwind-admin.com/ui-blocks/card#resultofpoll',
                    },
                    {
                        id: uniqueId(),
                        name: 'Social Post Card',
                        url: 'https://tailwind-admin.com/ui-blocks/card#socialpostcard',
                    },
                ],
            },
            {
                name: 'HR',
                id: uniqueId(),
                icon: 'solar:object-scan-linear',
                children: [
                    {
                        id: uniqueId(),
                        name: 'Employee',
                        url: '/hr/employee',
                    },
                    {
                        id: uniqueId(),
                        name: 'Download Banner',
                        url: 'https://tailwind-admin.com/ui-blocks/banner#downloadbanner',
                    },
                    {
                        id: uniqueId(),
                        name: 'Empty Cart Banner',
                        url: 'https://tailwind-admin.com/ui-blocks/banner#emptybanner',
                    },
                    {
                        id: uniqueId(),
                        name: 'Error Banner',
                        url: 'https://tailwind-admin.com/ui-blocks/banner#errorbanner',
                    },
                    {
                        id: uniqueId(),
                        name: 'Notifications Banner',
                        url: 'https://tailwind-admin.com/ui-blocks/banner#notificationsbanner',
                    },
                    {
                        id: uniqueId(),
                        name: 'Greeting Banner 2',
                        url: 'https://tailwind-admin.com/ui-blocks/banner#greetingbanner2',
                    },
                ],
            },
            {
                name: 'Charts',
                id: uniqueId(),
                icon: 'solar:pie-chart-2-linear',
                children: [
                    {
                        id: uniqueId(),
                        name: 'Revenue Updates Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#revenueupdateschart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Yarly Breakup Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#yarlybreakupchart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Monthly Earning Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#monthlyearning',
                    },
                    {
                        id: uniqueId(),
                        name: 'Yearly Sales Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#yearlysaleschart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Current Year Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#currentyear',
                    },
                    {
                        id: uniqueId(),
                        name: 'Weekly Stats Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#weeklystatschart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Expance Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#expancechart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Customers Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#customerschart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Earned Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#revenuechart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Follower Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#followerchart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Visit Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#visitchart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Income Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#incomechart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Impressions Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#impressionschart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Sales Overviewchart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#salesoverviewchart',
                    },
                    {
                        id: uniqueId(),
                        name: 'Total Earnings Chart',
                        url: 'https://tailwind-admin.com/ui-blocks/chart#totalearningschart',
                    },
                ],
            },
        ],
    },
];

export default SidebarContent;
