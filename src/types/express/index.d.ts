/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    namespace Express {
      interface Response {
        respond: (data: any, status: number) => void;
      }
      
      interface Request {
        user?: {
          id: string;
          email: string;
        };
      }
    }
}
  
export {};
