import { UseCase } from './use-case';

interface CreateUserCommand {
  name: string;
  email: string;
}

interface CreateUserResult {
  id: string;
  name: string;
}

class CreateUserUseCase implements UseCase<CreateUserCommand, CreateUserResult> {
  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    return { id: '1', name: command.name };
  }
}

describe('UseCase', () => {
  it('should execute a use case and return a result', async () => {
    const useCase = new CreateUserUseCase();
    const result = await useCase.execute({ name: 'John', email: 'john@test.com' });

    expect(result.id).toBe('1');
    expect(result.name).toBe('John');
  });
});
