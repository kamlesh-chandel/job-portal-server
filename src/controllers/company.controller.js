import { sendResponse } from '../utils/api.response.js';
import { registerCompanyService, getCompaniesByRecruiterService, updateCompanyService } from '../services/company.service.js';

export const registerCompany = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const file = req.files;

    const result = await registerCompanyService(req.body, user_id,file);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.company || null
    );
  } catch (error) {
    next(error);
  }
};

export const getMyCompanies = async (req, res, next) => {
  try {
    const { page, limit } = req.validatedQuery;
    const user_id = req.user?.user_id;

    const result = await getCompaniesByRecruiterService(user_id, page, limit);

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.companies
    );
  } catch (error) {
    next(error);
  }
};


export const updateCompany = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const company_id = req.params.id;
    const file = req.file;

    const result = await updateCompanyService(
      company_id,
      user_id,
      req.body,
      file
    );

    return sendResponse(
      res,
      result.status,
      result.success,
      result.message,
      result.company
    );
  } catch (error) {
    next(error);
  }
};
