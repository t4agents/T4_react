# Getting Started with Create React App

src/
├── api/                 # API 层 - 数据获取
├── assets/              # 静态资源 - 图片资源丰富
├── components/          # 组件层 - 大量业务组件
├── context/             # 状态管理 - 各模块的 Context
├── css/                 # 样式文件 - 模块化 CSS
├── layouts/             # 布局组件 - 页面骨架
├── lib/                 # 工具库 - 第三方服务集成
├── routes/              # 路由配置
├── types/               # TypeScript 类型定义
├── views/               # 视图层 - 页面组件
├── config.ts            # 配置文件
├── main.tsx             # 入口文件
└── App.tsx              # 根组件


src/features/payroll/
├── domain/                          # 核心业务逻辑
│   ├── entities/
│   │   ├── Employee.ts              # 来自 types/employee.ts
│   │   └── Payroll.ts               # 来自 types/payroll.ts
│   └── rules/
│       └── PayrollCalculator.ts      # 新建（业务规则）
│
├── application/                      # 应用用例
│   ├── commands/
│   │   └── ProcessPayrollCommand.ts  # 新建
│   └── queries/
│       └── GetPayrollDataQuery.ts    # 新建
│
├── infrastructure/                   # 外部依赖
│   ├── api/
│   │   ├── payroll-api.ts           # 来自 api/payroll/payroll-api.ts
│   │   └── employee-api.ts           # 来自 api/employee/employee-api.ts
│   └── repositories/
│       └── PayrollRepository.ts      # 新建
│
└── presentation/                     # UI层
    ├── components/
    │   ├── PayrollTable/
    │   │   ├── index.tsx
    │   │   ├── PayrollDataTable.tsx     # 来自 components/payroll/PayrollDataTable.tsx
    │   │   ├── CheckboxTable.tsx        # 来自 components/payroll/CheckboxTable.tsx
    │   │   ├── HoverTable.tsx           # 来自 components/payroll/HoverTable.tsx
    │   │   └── StripedRowTable.tsx      # 来自 components/payroll/StripedRowTable.tsx
    │   ├── PayrollPeriod/
    │   │   └── PayrollPeriodManager.tsx # 来自 components/payroll/PayrollPeriodManager.tsx（合并两个）
    │   ├── EmployeeForm/
    │   │   └── EmployeeFormModal.tsx    # 来自 views/apps/payroll/EmployeeFormModal.tsx
    │   └── PayrollForm/
    │       └── PayrollForm.tsx          # 来自 views/apps/payroll/PayrollForm.tsx
    │
    ├── pages/
    │   ├── PayrollPage.tsx              # 来自 views/apps/payroll/Payroll.tsx
    │   └── index.ts                      # 导出页面
    │
    ├── hooks/
    │   ├── usePayrollData.ts             # 新建（从 context 提取逻辑）
    │   └── useEmployeeData.ts             # 新建
    │
    └── context/
        └── PayrollContext.tsx            # 来自 context/payroll-context/index.tsx

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

