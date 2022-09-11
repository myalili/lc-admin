export async function getChoreResponse(response, prefix) {
  prefix = prefix ? `${prefix}: ` : '';
  try {
    const res = await response;
    if (res.success) {
      return res.content ?? true;
    } else {
      throw prefix + res.errorMessage;
    }
  } catch (err) {
    throw prefix + (typeof err === 'string' ? err : JSON.stringify(err));
  }
}

// export async function getShortChoreResponse(response, prefix) {
//   prefix = prefix ? `${prefix}: ` : '';
//   try {
//     const res = await response;
//     if (res.success) {
//       return res.content ?? true;
//     } else {
//       throw prefix + res.errorMessage;
//     }
//   } catch (err) {
//     throw prefix + (typeof err === 'string' ? err : JSON.stringify(err));
//   }
// }

export async function getInvokeResponse(response, prefix) {
  prefix = prefix ? `${prefix}: ` : '';
  try {
    const res = await response;
    if (res.code === 'WFE093435000') {
      return res.data ?? true;
    } else {
      throw prefix + res.msg;
    }
  } catch (err) {
    throw prefix + (typeof err === 'string' ? err : JSON.stringify(err));
  }
}

export async function getAuthResponse(response, prefix) {
  prefix = prefix ? `${prefix}: ` : '';
  try {
    const res = await response;
    if (res.success) {
      return res.content ?? true;
    } else {
      throw prefix + res.msg;
    }
  } catch (err) {
    throw prefix + (typeof err === 'string' ? err : JSON.stringify(err));
  }
}

export async function getScResponse(response, prefix) {
  prefix = prefix ? `${prefix}: ` : '';
  try {
    const res = await response;
    if (res.status === 200) {
      return res.data ?? true;
    } else {
      throw prefix + res.message;
    }
  } catch (err) {
    throw prefix + (typeof err === 'string' ? err : JSON.stringify(err));
  }
}

// export async function getAsoeResponse(response, prefix) {
//   prefix = prefix ? `${prefix}: ` : '';
//   try {
//     const res = await response;
//     if (res.success) {
//       return res.content ?? true;
//     } else {
//       throw prefix + res.errorMessage;
//     }
//   } catch (err) {
//     throw prefix + (typeof err === 'string' ? err : JSON.stringify(err));
//   }
// }
