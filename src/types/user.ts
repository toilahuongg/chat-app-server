export interface IUser {
  username: string;
  password: string;
  fullname: string;
  devices: IDevice[]
}

export interface IDevice {
  id: string;
  ip: string;
  name: string;
  location: string;
  refreshToken: string;
}