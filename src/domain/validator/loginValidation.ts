import { object, string } from 'yup';

export const loginValidation = async (data) =>{
  const schemaRule = object({
    email: string().required(),
    password: string().required()
  });

  const validate = await schemaRule.validate(data);
  return validate
}
