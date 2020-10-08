export default interface IAdjustTextProvider {
  adjust(payload: string): Promise<string>;
}
