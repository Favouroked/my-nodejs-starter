class UtilityService {
  static validatePrams(data, params) {
    const errors = [];
    params.map((value) => {
      if (!Object.hasOwnProperty.call(data, value)) {
        errors.push(value);
      }
      return value;
    });
    return errors.length > 0 ? { status: false, message: errors } : { status: true };
  }
}

module.exports = UtilityService;
