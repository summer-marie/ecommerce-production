export const normalizeBase64Image = (imageInput) => {
  if (!imageInput) {
    return null;
  }

  if (typeof imageInput === "string") {
    const trimmed = imageInput.trim();
    if (!trimmed) {
      return null;
    }
    return {
      data: trimmed,
      filename: null,
      mimetype: null,
    };
  }

  if (typeof imageInput !== "object") {
    return null;
  }

  const { data, filename, mimetype, size } = imageInput;

  if (typeof data !== "string" || !data.trim()) {
    return null;
  }

  const toDataUrl = (value, typeHint) => {
    const trimmed = value.trim();
    if (trimmed.startsWith("data:")) {
      return trimmed;
    }
    if (typeHint) {
      return `data:${typeHint};base64,${trimmed}`;
    }
    return trimmed;
  };

  const normalizedData = toDataUrl(data, mimetype);

  const normalized = {
    data: normalizedData,
    filename: filename || null,
    mimetype: mimetype || null,
  };

  if (typeof size === "number") {
    normalized.size = size;
  }

  return normalized;
};
