const stringToBool = (value) => {
  try {
    switch (value.toLowerCase()) {
      case "true":
        return true;
      case "false":
        return false;
      case "":
        return false;
      default:
        return undefined;
    }
  } catch {
    return undefined;
  }
};

export default {
  stringToBool,
};
