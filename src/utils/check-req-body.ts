const checkRequestBody = (reqBody: {}, reqEnum: {}) => {
  return Object.keys(reqBody).length === Object.keys(reqEnum).length;
};

export default checkRequestBody;
