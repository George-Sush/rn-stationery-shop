// Фейковая проверка логина и пароля

export interface Credentials {
  login: string;
  password: string;
}

export const DEMO_LOGIN = 'admin';
const DEMO_PASSWORD = 'password';

const FAKE_NETWORK_DELAY_MS = 600;

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Неверный логин или пароль');
    this.name = 'InvalidCredentialsError';
  }
}

export async function loginWithPassword({ login, password }: Credentials): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, FAKE_NETWORK_DELAY_MS));

  if (login.trim() !== DEMO_LOGIN || password !== DEMO_PASSWORD) {
    throw new InvalidCredentialsError();
  }
  return `fake-token-${Date.now()}`;
}
