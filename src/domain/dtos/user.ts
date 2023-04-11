export interface CreateUser {
  email: string;
  fullName: string;
  description?: string;
  phoneNumber: string;
  profileImage?: any;
  username: string;
  password: string;

}

export interface Login {
  email: string;
  password: string;
}

export interface Token {
  token: string
}

export interface UpdateProfile {
  fullName: string;
  description: string;
  phoneNumber: string;
  profileImage: any;
}

export interface UpdatePassword {
  oldPassword: string;
  retypePassword: string;
  newPassword: string;
}
