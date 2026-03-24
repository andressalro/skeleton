import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base-controller';

class TestController extends BaseController {
  private shouldFail = false;
  private responseData: any = undefined;

  setFail(fail: boolean) {
    this.shouldFail = fail;
  }

  setResponseData(data: any) {
    this.responseData = data;
  }

  protected async executeImpl(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    if (this.shouldFail) {
      throw new Error('Something went wrong');
    }
    this.ok(res, this.responseData);
  }
}

function mockResponse(): Response {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe('BaseController', () => {
  let controller: TestController;

  beforeEach(() => {
    controller = new TestController();
  });

  it('should call executeImpl and return ok with data', async () => {
    const req = {} as Request;
    const res = mockResponse();
    const next = jest.fn();

    controller.setResponseData({ id: '1' });
    await controller.execute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true, data: { id: '1' } });
  });

  it('should call next with error when executeImpl throws', async () => {
    const req = {} as Request;
    const res = mockResponse();
    const next = jest.fn();

    controller.setFail(true);
    await controller.execute(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return 200 without body when no data', async () => {
    const req = {} as Request;
    const res = mockResponse();
    const next = jest.fn();

    await controller.execute(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });
});
