import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import CitiesController from '../controllers/CitiesController';

const citiesRouter = Router();
const citiesControler = new CitiesController();

citiesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string(),
      uf: Joi.string().min(2),
    },
  }),
  citiesControler.index,
);

citiesRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  citiesControler.show,
);

citiesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      uf: Joi.string().min(2).max(2).required(),
    },
  }),
  citiesControler.create,
);

export default citiesRouter;
