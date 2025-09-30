export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterAdminDto {
  username: string;
  email: string;
  password: string;
  role?: number;
}
