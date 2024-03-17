/** @type {import('cz-git').UserConfig['prompt']['types']} */
const types = [
  {
    value: 'feat',
    get name() {
      return `${this.value}:      ${this.emoji} 新增功能`
    },
    emoji: '✨',
  },
  {
    value: 'fix',
    get name() {
      return `${this.value}:       ${this.emoji} 修复缺陷`
    },
    emoji: '🐛',
  },
  {
    value: 'docs',
    get name() {
      return `${this.value}:      ${this.emoji} 文档变更`
    },
    emoji: '📝',
  },
  {
    value: 'style',
    get name() {
      return `${this.value}:     ${this.emoji} 代码格式（不影响功能，例如空格、分号等格式修正）`
    },
    emoji: '💄',
  },
  {
    value: 'refactor',
    get name() {
      return `${this.value}:  ${this.emoji} 代码重构（不包括 bug 修复、功能新增）`
    },
    emoji: '♻️',
  },
  {
    value: 'perf',
    get name() {
      return `${this.value}:      ${this.emoji} 性能优化`
    },
    emoji: '⚡️',
  },
  {
    value: 'test',
    get name() {
      return `${this.value}:      ${this.emoji} 添加疏漏测试或已有测试改动`
    },
    emoji: '✅',
  },
  {
    value: 'build',
    get name() {
      return `${this.value}:     ${this.emoji} 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）`
    },
    emoji: '📦️',
  },
  {
    value: 'ci',
    get name() {
      return `${this.value}:        ${this.emoji} 修改 CI 配置、脚本`
    },
    emoji: '🎡',
  },
  {
    value: 'revert',
    get name() {
      return `${this.value}:    ${this.emoji} 回滚 commit`
    },
    emoji: '⏪️',
  },
  {
    value: 'chore',
    get name() {
      return `${this.value}:     ${this.emoji} 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）`
    },
    emoji: '🔨',
  },
]

/** @type {import('cz-git').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'type-enum': [2, 'always', types.map(({ value }) => value)],

    'scope-case': [2, 'always', 'pascal-case'],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: '选择关联issue前缀（可选）:',
      customFooterPrefixs: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    types,
    useEmoji: true,
    emojiAlign: 'center',
    themeColorCode: '',
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: '以上都不是？我要自定义',
    emptyScopesAlias: '跳过',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixs: [
      // 如果使用 gitee 作为开发管理
      { value: 'link', name: '     链接 ISSUES 进行中' },
      { value: 'closed', name: '   标记 ISSUES 已完成' },
    ],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias: '跳过',
    customIssuePrefixsAlias: '自定义前缀',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    maxHeaderLength: Number.POSITIVE_INFINITY,
    maxSubjectLength: Number.POSITIVE_INFINITY,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
}

module.exports = config
