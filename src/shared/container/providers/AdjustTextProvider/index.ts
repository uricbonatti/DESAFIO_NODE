import { container } from 'tsyringe';
import IAdjustTextProvider from './models/IAdjustTextProvider';
import RemoveAccentsProvider from './implementations/RemoveAccentsProvider';

container.registerSingleton<IAdjustTextProvider>(
  'AdjustTextProvider',
  RemoveAccentsProvider,
);
