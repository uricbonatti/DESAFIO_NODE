import { remove } from 'remove-accents';

import IAdjustTextProvider from '../models/IAdjustTextProvider';

class RemoveAccentsProvider implements IAdjustTextProvider {
  public async adjust(payload: string): Promise<string> {
    return remove(payload).toUpperCase();
  }
}

export default RemoveAccentsProvider;
