import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import CustomersController from '../controllers/CustomersController';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().required(),
    },
  }),
  customersController.search,
);

customersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customersController.show,
);

customersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  customersController.delete,
);

customersRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      fullname: Joi.string().required(),
    },
  }),
  customersController.rename,
);

customersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      fullname: Joi.string().required(),
      gender: Joi.string().valid('male', 'female'),
      city_id: Joi.string().uuid().required(),
      birthday: Joi.date().required(),
    },
  }),
  customersController.create,
);

export default customersRouter;
