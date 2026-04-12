let toastrCallback = null;

export function appToastr(cb) {
  toastrCallback = cb;
}

export function showToast(message, type = "info", duration = 3000) {
  if (toastrCallback) toastrCallback(message, type, duration);
}
