import IAdjustTextProvider from '../models/IAdjustTextProvider';

export default class FakeAdjustTextProvider implements IAdjustTextProvider {
  public async adjust(payload: string): Promise<string> {
    return payload.toUpperCase();
  }
}
