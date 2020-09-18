import { Results } from './generic';

export type Changes = Results<Change>;

interface Change {
  id?: number;
  adult?: boolean | null;
}
