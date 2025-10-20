import { errorHandler } from "../../middlewares/errorHandler.middleware";
import { AppError } from "../../utils/AppError";


beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
  });


describe("Middleware errorHandler", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("deve lidar com AppError corretamente", () => {
    const err = new AppError("Recurso não encontrado", 404, "RECURSO_NAO_ENCONTRADO");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: "fail",
      message: "Recurso não encontrado",
      code: "RECURSO_NAO_ENCONTRADO",
    }));
  });

  it("deve lidar com erro genérico", () => {
    const err = new Error("Erro interno do servidor");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: "error",
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    }));
  });

  it("deve lidar com AppError de acesso negado", () => {
    const err = new AppError("Acesso negado", 403, "ACESSO_NEGADO");

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: "fail",
      message: "Acesso negado",
      code: "ACESSO_NEGADO",
    }));
  });
});
