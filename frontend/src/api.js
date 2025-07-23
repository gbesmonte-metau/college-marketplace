export async function getRequest(url, isAuthenticated) {
  try {
    let response;
    if (isAuthenticated) {
      response = await fetch(url, {
        credentials:  "include"
      })
    }
    else {
      response = await fetch(url);
    }
    return response;
  } catch (error) {
    alert(error);
  }
}

export async function postRequest(url, postBody) {
  const settings = {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  };
  try {
    const response = await fetch(url, settings);
    return response;
  } catch (error) {
    alert(error);
  }
}

export async function patchRequest(url, patchBody) {
  const settings = {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patchBody),
  };
  try {
    const response = await fetch(url, settings);
    return response;
  } catch (error) {
    alert(error);
  }
}
