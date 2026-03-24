import 'reflect-metadata';
import { container as tsyringeContainer, injectable, singleton, inject } from 'tsyringe';
import type { InjectionToken } from 'tsyringe';

export const container = tsyringeContainer;

export function registerSingleton<T>(token: InjectionToken<T>, value: { new (...args: any[]): T }): void {
  container.registerSingleton(token, value);
}

export function registerTransient<T>(token: InjectionToken<T>, value: { new (...args: any[]): T }): void {
  container.register(token, { useClass: value });
}

export function resolve<T>(token: InjectionToken<T>): T {
  return container.resolve(token);
}

export { injectable, singleton, inject };
