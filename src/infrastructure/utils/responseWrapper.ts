
export interface APIResponse {
  wrap(res: Response, code: number, isSuccess: boolean, message: string, data: any);
}

export class APIResponseImpl implements APIResponse {
  wrap(res, code, isSuccess, message, data):Response{
    return res.status(code).json({success: isSuccess, message, data})
  }
  
}
