import type { Command } from '../../commands.js'

export default {
  type: 'local-jsx',
  name: 'web',
  description: 'Launch Claude Code web interface',
  load: () => import('./web.js'),
} satisfies Command
