
export const SALT_ROUNDS = 10

export interface SignupData {
    email: string;
    password: string;
  }
  
 export interface SigninData {
    email: string;
    password: string;
  }
  
export  interface TokenPayload {
    id: string;
    email: string;
  }