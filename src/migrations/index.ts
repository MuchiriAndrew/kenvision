import * as migration_20260922_192010_init from './20260922_192010_init';

export const migrations = [
  {
    up: migration_20260922_192010_init.up,
    down: migration_20260922_192010_init.down,
    name: '20260922_192010_init'
  },
];
