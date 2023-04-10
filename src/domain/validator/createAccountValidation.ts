import { object, string } from 'yup';

export const createAccountValidation = async (data) =>{
  const schemaRule = object({
    email: string().required(),
    password: string().required(),
    username: string().required()
  });

  const validate = await schemaRule.validate(data);
  return validate
}