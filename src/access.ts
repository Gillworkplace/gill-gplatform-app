function homeAccess(currentUser?: API.CurrentUser) {
  if (!currentUser) {
    return {};
  }
  const permissions = currentUser.permissions;
  return {
    home: permissions.has('permission.admin') || permissions.has('permission.home'),
  };
}

function adminAccess(currentUser?: API.CurrentUser) {
  if (!currentUser) {
    return {};
  }
  const permissions = currentUser.permissions;
  return {
    admin: permissions.has('permission.admin'),
  };
}

function superAdminAccess(currentUser?: API.CurrentUser) {
  if (!currentUser) {
    return {};
  }
  return {
    superAdmin: currentUser.username === 'admin',
  };
}

function chatAccess(currentUser?: API.CurrentUser) {
  if (!currentUser) {
    return {};
  }
  const permissions = currentUser.permissions;
  return {
    chat: permissions.has('permission.admin') || permissions.has('permission.chat'),
  };
}

function registerAccess(currentUser?: API.CurrentUser) {
  if (!currentUser) {
    return {};
  }
  const permissions = currentUser.permissions;
  return {
    register: permissions.has('permission.admin') || permissions.has('permission.register'),
  };
}

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    ...homeAccess(currentUser),
    ...adminAccess(currentUser),
    ...superAdminAccess(currentUser),
    ...chatAccess(currentUser),
    ...registerAccess(currentUser),
  };
}
