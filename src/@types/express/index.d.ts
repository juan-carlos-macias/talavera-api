/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    namespace Express {
      interface Response {
        respond: (data: any, status: number) => void;
      }
  
    }
}
  
  export {};