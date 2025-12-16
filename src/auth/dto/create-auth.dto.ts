export class CreateUserDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
