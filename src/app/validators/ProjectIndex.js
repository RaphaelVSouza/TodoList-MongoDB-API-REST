import * as Yup from 'yup';

export default async (req, res, next) => {

    try {
        const validationSchema = Yup.object({
          title: Yup.string().min(3).max(100),
          skip: Yup.number().min(0).max(999).default(0),
          limit: Yup.number().min(0).max(999).default(10),
        });

        await validationSchema.validate(req.query, { abortEarly: false });

        return next();

    } catch(err) {
        return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    };
};
